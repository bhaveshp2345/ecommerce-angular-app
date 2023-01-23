import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";

import { EcommerceService } from "app/main/apps/ecommerce/ecommerce.service";

@Component({
  selector: "app-ecommerce-item",
  templateUrl: "./ecommerce-item.component.html",
  styleUrls: ["./ecommerce-item.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "ecommerce-application" },
})
export class EcommerceItemComponent implements OnInit {
  // Input Decorotor
  @Input() product;

  /**
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  toggleProductAvailibility() {
    const tempProduct = {
      ...this.product,
      isDisabled: !this.product.isDisabled,
    };
    this._ecommerceService.onProductEditChange.next(tempProduct);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
}
