import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  Brands,
  Categories,
  FilterList,
  MultiRange,
} from "app/main/main-constants";
import { EcommerceService } from "../../ecommerce.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "ecommerce-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["../ecommerce-shop.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EcommerceSidebarComponent implements OnInit {
  // Public
  public productFilter;
  public productMultiRange;
  public sliderPriceValue;
  public productCategories;
  public productBrands;
  public productRating;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private _ecommerceService: EcommerceService) {
    this._unsubscribeAll = new Subject();
    this.productMultiRange = this._ecommerceService.initialMultiRange;
    this.sliderPriceValue = this._ecommerceService.initialPriceRange;
    this.productCategories = this._ecommerceService.initialCategories;
    this.productBrands = this._ecommerceService.initialBrands;
    this.productRating = this._ecommerceService.initialRating;
  }

  ngOnInit(): void {
    this._ecommerceService.productFilter$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((filterState) => {
        this.productFilter = filterState;
      });
  }

  clearAllFilters() {
    this.resetMultiRange();
    this.resetPriceRange();
    this.resetCategories();
    this.resetBrandSelection();
    this._ecommerceService.onInitialFilterChange.next(
      this._ecommerceService.initialFilter
    );
  }

  //#region MultiRange functions
  changeMultiRange(event) {
    const val = event.target.value;
    if (val) {
      this.resetMultiRange();
      this.multiRangeValueSync(val);
      const newProductFilter: FilterList = {
        ...this.productFilter,
        multiRange: val,
      };
      this._ecommerceService.onInitialFilterChange.next(newProductFilter);
    }
  }

  private resetMultiRange() {
    this.productMultiRange = this.productMultiRange.map((item) => {
      return { ...item, checked: false };
    });
  }

  private multiRangeValueSync(val: MultiRange) {
    const foundIdx = this.productMultiRange.findIndex(
      (item) => item.value === val
    );
    if (foundIdx == -1) return false;
    this.productMultiRange[foundIdx].checked = true;
  }
  //#endregion

  //#region price range functions
  changePriceRange(event) {
    const val = event;
    if (val) {
      const newProductFilter: FilterList = {
        ...this.productFilter,
        priceRangeFilter: { min: val[0], max: val[1] },
      };
      this._ecommerceService.onInitialFilterChange.next(newProductFilter);
    }
  }

  private resetPriceRange() {
    this.sliderPriceValue = [1, 100];
  }
  //#endregion

  //#region category change functions
  changeCategories(event) {
    const val = event.target.value;
    if (val) {
      this.resetCategories();
      this.categoriesValueSync(val);
      const newProductFilter: FilterList = {
        ...this.productFilter,
        categories: val.toLowerCase(),
      };
      this._ecommerceService.onInitialFilterChange.next(newProductFilter);
    }
  }

  private resetCategories() {
    this.productCategories = this.productCategories.map((item) => {
      return { ...item, checked: false };
    });
  }

  private categoriesValueSync(val: Categories) {
    const foundIdx = this.productCategories.findIndex(
      (item) => item.value === val
    );
    if (foundIdx == -1) return false;
    this.productCategories[foundIdx].checked = true;
  }
  //#endregion

  //#region Brand selection functions
  changeBrands(event) {
    const selectedBrandArr = this.getListOfBrands();
    const newProductFilter: FilterList = {
      ...this.productFilter,
      brands: selectedBrandArr,
    };
    this._ecommerceService.onInitialFilterChange.next(newProductFilter);
  }

  private getListOfBrands() {
    return this.productBrands
      .filter((item) => item.checked)
      .map((item) => item.key.toLowerCase());
  }

  private resetBrandSelection() {
    this.productBrands = this.productBrands.map((item) => {
      return { ...item, checked: false };
    });
  }
  //#endregion

  //#region Rating functions
  ratingChange(event) {
    const val = event;
    if (val) {
      const newProductFilter: FilterList = {
        ...this.productFilter,
        ratings: val,
      };
      this._ecommerceService.onInitialFilterChange.next(newProductFilter);
    }
  }

  //#endregion

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
