import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { EcommerceService } from "app/main/apps/ecommerce/ecommerce.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-ecommerce-shop",
  templateUrl: "./ecommerce-shop.component.html",
  styleUrls: ["./ecommerce-shop.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "ecommerce-application" },
})
export class EcommerceShopComponent implements OnInit {
  // public
  public contentHeader: object;
  public shopSidebarToggle = false;
  public shopSidebarReset = false;
  public gridViewRef = true;
  public products;
  public wishlist;
  public cartList;
  public page = 1;
  public pageSize = 9;
  public searchText = "";
  public selectedSortOrder = "Featured";

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {EcommerceService} _ecommerceService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _ecommerceService: EcommerceService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Update to List View
   */
  listView() {
    this.gridViewRef = false;
  }

  /**
   * Update to Grid View
   */
  gridView() {
    this.gridViewRef = true;
  }

  /**
   * Sort Product
   */
  sortProduct(sortParam) {
    this.selectedSortOrder = this._ecommerceService.getSortLabel(sortParam);
    this._ecommerceService.sortProduct(sortParam);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to ProductList change
    this._ecommerceService.onProductListChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.products = res;
      });

    // content header
    this.contentHeader = {
      headerTitle: "Shop",
      actionButton: false,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: false,
            link: "/",
          },
          {
            name: "eCommerce",
            isLink: false,
            link: "/",
          },
          {
            name: "Shop",
            isLink: false,
          },
        ],
      },
    };
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
