import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FilterList } from "app/main/main-constants";
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
  public sliderPriceValue = [1, 100];
  public productFilter;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private _ecommerceService: EcommerceService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._ecommerceService.productFilter$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((filterState) => {
        this.productFilter = filterState;
      });
  }

  changeMultiRange(event) {
    const val = event.target.value;
    if (val) {
      const newProductFilter: FilterList = {
        ...this.productFilter,
        multiRange: val,
      };
      this._ecommerceService.onInitialFilterChange.next(newProductFilter);
    }
  }

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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
