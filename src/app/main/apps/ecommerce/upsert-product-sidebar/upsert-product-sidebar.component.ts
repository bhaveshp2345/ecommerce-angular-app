import { Component, OnInit } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { EcommerceService } from "../ecommerce.service";
import { Categories } from "app/main/main-constants";

@Component({
  selector: "app-upsert-product-sidebar",
  templateUrl: "./upsert-product-sidebar.component.html",
  styleUrls: ["./upsert-product-sidebar.component.scss"],
})
export class UpsertProductSidebarComponent implements OnInit {
  public image;
  public title;
  public brand;
  public price;
  public description;
  public productCategory = Categories.APPLIANCES;
  public categoryList = this._ecommerceService.initialCategories;
  public rating = 4;
  public productColors = [
    { color: "orange", child: "bg-primary", parent: "b-primary" },
    { color: "green", child: "bg-success", parent: "b-success" },
    { color: "red", child: "bg-danger", parent: "b-danger" },
    { color: "blue", child: "bg-info", parent: "b-info" },
  ];
  public selectedColor = "green";
  public productShippingType = "free";

  loading = false;
  error = "";
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _ecommerceService: EcommerceService
  ) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {}

  changeColor(color: string) {
    this.selectedColor = color;
  }

  submit(form) {
    if (form.valid) {
      this.loading = true;
      const formVal = form.value;
      const productBody = {
        name: formVal["product-title"],
        image: "assets/images/pages/eCommerce/27.png",
        brand: formVal["product-brand"],
        price: formVal["product-price"],
        description: formVal["product-description"],
        rating: formVal["rating"],
        categoery: formVal["category"],
        color: this.selectedColor,
        hasFreeShipping: formVal["shipping_type"] === "free" ? true : false,
        slug: formVal["product-title"],
        isStockAvailable: true,
        isDisabled: false,
      };
      this._ecommerceService.onNewProductChange.next(productBody);
      this.toggleSidebar("upsert-product-sidebar");
    }
  }
}
