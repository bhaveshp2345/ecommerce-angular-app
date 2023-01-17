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

  // Public
  public isProductDisabled = false;

  /**
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  toggleProductDisable() {
    this.isProductDisabled = !this.isProductDisabled;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
}
