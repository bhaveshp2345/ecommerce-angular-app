import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import {
  Brands,
  Categories,
  FilterList,
  MultiRange,
  PriceRange,
} from "app/main/main-constants";

import { of, BehaviorSubject, Observable } from "rxjs";
import {
  catchError,
  tap,
  debounceTime,
  switchMap,
  filter,
} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EcommerceService implements Resolve<any> {
  // Public
  public productList: Array<any>;
  public filteredProductList: Array<any>;
  public wishlist: Array<any>;
  public cartList: Array<any>;
  public selectedProduct;
  public relatedProducts;

  public onProductListChange: BehaviorSubject<any>;
  public onRelatedProductsChange: BehaviorSubject<any>;
  public onSelectedProductChange: BehaviorSubject<any>;

  public onProductEditChange: BehaviorSubject<any>;

  public onInitialFilterChange: BehaviorSubject<any>;
  public productFilter$: Observable<any>;

  public onNewProductChange: BehaviorSubject<any>;
  public newproduct$: Observable<any>;

  public initialFilter = {
    categories: Categories.APPLIANCES,
    multiRange: MultiRange.ALL,
    priceRangeFilter: { min: 1, max: 100 },
    ratings: 0,
    brands: [],
  };

  public initialMultiRange = [
    { label: "All", value: MultiRange.ALL, checked: false },
    { label: "<=$10", value: MultiRange.LESS_EQ_10, checked: false },
    { label: "$10 - $100", value: MultiRange.FROM_10_TO_100, checked: false },
    { label: "$100 - $500", value: MultiRange.FROM_100_TO_500, checked: false },
    { label: ">= $500", value: MultiRange.GREAT_EQ_500, checked: false },
  ];

  public initialPriceRange = [1, 100];
  public initialCategories = [
    { label: "Appliances", value: Categories.APPLIANCES, checked: false },
    { label: "Audio", value: Categories.AUDIO, checked: false },
    {
      label: "Cameras & Camcorders",
      value: Categories.CAMERAS_CAMCORDERS,
      checked: false,
    },
    {
      label: "Car Electronics & GPS",
      value: Categories.CAR_ELECTRONICS_GPS,
      checked: false,
    },
    { label: "Cell Phones", value: Categories.CELL_PHONES, checked: false },
    {
      label: "Computers & Tablets",
      value: Categories.COMPUTERS_TABLETS,
      checked: false,
    },
    {
      label: "Health, Fitness & Beauty",
      value: Categories.HEALTH_FITNESS_BEAUTY,
      checked: false,
    },
    {
      label: "Office & School Supplies",
      value: Categories.OFFICE_SCHOOL_SUPPLIES,
      checked: false,
    },
    {
      label: "TV & Home Theater",
      value: Categories.TV_HOME_THEATER,
      checked: false,
    },
    { label: "Video Games", value: Categories.VIDEO_GAMES, checked: false },
  ];

  public initialBrands = [
    { key: Brands.APPLE, checked: false, counts: 746 },
    { key: Brands.ONEODIO, checked: false, counts: 677 },
    { key: Brands.SHARP, checked: false, counts: 625 },
    { key: Brands.GOOGLE, checked: false, counts: 567 },
    { key: Brands.PHILIPS, checked: false, counts: 514 },
    { key: Brands.LOGITECH, checked: false, counts: 497 },
    { key: Brands.NIKE, checked: false, counts: 456 },
    { key: Brands.BUGANI, checked: false, counts: 411 },
    { key: Brands.SONY, checked: false, counts: 402 },
    { key: Brands.TAS, checked: false, counts: 378 },
    { key: Brands.ADIDAS, checked: false, counts: 321 },
  ];

  public initialRating = [
    { rating: 4, counts: 160 },
    { rating: 3, counts: 176 },
    { rating: 2, counts: 291 },
    { rating: 1, counts: 190 },
  ];

  // Private

  private idHandel;
  private sortRef = (key) => (a, b) => {
    const fieldA = a[key];
    const fieldB = b[key];

    let comparison = 0;
    if (fieldA > fieldB) {
      comparison = 1;
    } else if (fieldA < fieldB) {
      comparison = -1;
    }
    return comparison;
  };

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _router: Router) {
    this.onProductListChange = new BehaviorSubject({});
    this.onRelatedProductsChange = new BehaviorSubject({});
    this.onSelectedProductChange = new BehaviorSubject({});
    this.initializeFilter();
    this.initializeProductEdit().subscribe();
    this.initializeProductCreate().subscribe();
  }

  private initializeFilter() {
    this.onInitialFilterChange = new BehaviorSubject(this.initialFilter);
    this.productFilter$ = this.onInitialFilterChange.asObservable().pipe(
      debounceTime(100),
      tap((item) => this.triggerFilterProducts(item))
    );
  }

  private initializeProductEdit() {
    this.onProductEditChange = new BehaviorSubject(null);
    return this.onProductEditChange.asObservable().pipe(
      debounceTime(200),
      filter((item) => item != null),
      switchMap((product) => this.updateProductEdit(product))
    );
  }

  private initializeProductCreate() {
    this.onNewProductChange = new BehaviorSubject(null);
    return this.onNewProductChange.asObservable().pipe(
      debounceTime(200),
      filter((item) => item != null),
      switchMap((product) => this.registerProductProcess(product))
    );
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this.idHandel = route.params.id;

    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getProducts(), this.getSelectedProduct()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get("api/ecommerce-products")
        .subscribe((response: any) => {
          this.productList = response;
          this.sortProduct("featured"); // Default shorting
          resolve(this.productList);
        }, reject);
    });
  }

  getSelectedProduct(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get("api/ecommerce-products?id=" + this.idHandel)
        .subscribe((response: any) => {
          this.selectedProduct = response;
          this.onSelectedProductChange.next(this.selectedProduct);
          resolve(this.selectedProduct);
        }, reject);
    });
  }

  getRelatedProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get("api/ecommerce-relatedProducts")
        .subscribe((response: any) => {
          this.relatedProducts = response;
          this.onRelatedProductsChange.next(this.relatedProducts);
          resolve(this.relatedProducts);
        }, reject);
    });
  }

  private editProduct(product: any) {
    return this._httpClient.put(
      "api/ecommerce-products/" + product.id,
      product
    );
  }

  private registerNewProduct(product: any) {
    return this._httpClient.post("api/ecommerce-products/", product);
  }

  //#region register products functions
  registerProductProcess(newProduct) {
    return this.registerNewProduct(newProduct).pipe(
      catchError((err) => {
        return of(err);
      }),

      tap((response: any) => {
        this.updateNewProduct(response);
      })
    );
  }

  private updateNewProduct(newItem) {
    this.productList = [newItem, ...this.productList];
    this.onProductListChange.next(this.productList);
  }
  //#endregion

  //#region Toggle product availibity
  private updateProductEdit(editedProduct) {
    return this.editProduct(editedProduct).pipe(
      catchError((err) => {
        return of(err);
      }),

      tap((response: any) => {
        this.updateProductValue(response);
      })
    );
  }

  private updateProductValue(editedResult) {
    if (this._router.url.includes("edit")) {
      this._router.navigate(["/apps/e-commerce/details/" + editedResult?.id]);
    } else {
      let prodIdx;
      prodIdx = this.productList.findIndex(
        (item) => item.id == editedResult.id
      );
      if (prodIdx != -1) {
        this.productList[prodIdx] = editedResult;
        if (!this.filteredProductList)
          this.onProductListChange.next(this.productList);
        this.selectedProduct = [editedResult];
        this.onSelectedProductChange.next(this.selectedProduct);
      }
      if (this.filteredProductList) {
        prodIdx = this.filteredProductList.findIndex(
          (item) => item.id == editedResult.id
        );
        if (prodIdx != -1) {
          this.filteredProductList[prodIdx] = editedResult;
          this.onProductListChange.next(this.filteredProductList);
        }
      }
    }
  }
  //#endregion

  sortProduct(sortBy) {
    let sortDesc = false;

    const sortByKey = (() => {
      if (sortBy === "price-desc") {
        sortDesc = true;
        return "price";
      }
      if (sortBy === "price-asc") {
        return "price";
      }
      sortDesc = true;
      return "id";
    })();

    const sortedData = this.productList.sort(this.sortRef(sortByKey));
    if (sortDesc) sortedData.reverse();
    this.productList = sortedData;
    this.onProductListChange.next(this.productList);
  }

  getSortLabel(sortBy) {
    switch (sortBy) {
      case "featured": {
        return "Featured";
      }
      case "price-asc": {
        return "Lowest";
      }
      case "price-desc": {
        return "Highest";
      }
      default: {
        return "Featured";
      }
    }
  }

  //#region Sidebar Filter
  private triggerFilterProducts(filterList: FilterList) {
    this.filteredProductList = [...this.productList];
    this.filteredProductList = this.multiRangeFilter(filterList.multiRange);
    this.filteredProductList = this.priceRangeFilter(
      filterList.priceRangeFilter
    );
    this.filteredProductList = this.categoriesFilter(filterList.categories);
    this.filteredProductList = this.brandsFilter(filterList.brands);
    this.filteredProductList = this.ratingFilter(filterList.ratings);
    this.onProductListChange.next(this.filteredProductList);
  }

  //#region  Multirange filter
  private multiRangeFilter(multiRange: MultiRange) {
    const multiRangeOp = this.getOperationDetails(multiRange);
    if (multiRangeOp == null) return this.filteredProductList;
    return this.filteredProductList.filter(
      (item) => item.price >= multiRangeOp.min && item.price <= multiRangeOp.max
    );
  }

  private getOperationDetails(multiRange: MultiRange) {
    if (multiRange == MultiRange.ALL) return null;
    else if (multiRange == MultiRange.FROM_10_TO_100) {
      return { min: 10, max: 100 };
    } else if (multiRange == MultiRange.FROM_100_TO_500)
      return { min: 100, max: 500 };
    else if (multiRange == MultiRange.LESS_EQ_10) return { min: 0, max: 10 };
    else if (multiRange == MultiRange.GREAT_EQ_500)
      return { min: 500, max: 9999999 };
  }
  //#endregion

  //#region Price Range Filter
  private priceRangeFilter(priceRange: PriceRange) {
    if (priceRange.min === 1 && priceRange.max === 100)
      return this.filteredProductList;
    return this.filteredProductList.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );
  }
  //#endregion

  //#region Categories Filter
  private categoriesFilter(category: Categories) {
    if (category === Categories.APPLIANCES) return this.filteredProductList;
    return this.filteredProductList.filter(
      (item) => item.categoery.toLowerCase() == category
    );
  }
  //#endregion

  // #region Categories Filter
  private brandsFilter(brands: Brands[]) {
    if (brands.length === 0) return this.filteredProductList;
    return this.filteredProductList.filter((item) =>
      brands.includes(item.brand.toLowerCase())
    );
  }
  // #endregion

  // #region rating filter
  private ratingFilter(ratings: number) {
    if (ratings === 0) return this.filteredProductList;
    return this.filteredProductList.filter((item) =>
      ratings == 4 ? item.rating >= ratings : item.rating === ratings
    );
  }
  // #endregion

  //#endregion
}
