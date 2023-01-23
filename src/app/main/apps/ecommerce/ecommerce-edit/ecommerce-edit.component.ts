import { Component, OnInit } from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { cloneDeep } from "lodash";
import { EcommerceEditService } from "./ecommerce-edit.service";
import { Categories } from "app/main/main-constants";
import { EcommerceService } from "../ecommerce.service";

@Component({
  selector: "app-ecommerce-edit",
  templateUrl: "./ecommerce-edit.component.html",
  styleUrls: ["./ecommerce-edit.component.scss"],
})
export class EcommerceEditComponent implements OnInit {
  // Public
  public currentRow;
  public tempRow;
  public avatarImage: string;
  isStockAvailable = 1;
  productColors = [
    { color: "orange", child: "bg-primary", parent: "b-primary" },
    { color: "green", child: "bg-success", parent: "b-success" },
    { color: "red", child: "bg-danger", parent: "b-danger" },
    { color: "blue", child: "bg-info", parent: "b-info" },
  ];
  public productCategory = Categories.APPLIANCES;
  public categoryList = this._ecommerceService.initialCategories;
  productRating = 4;
  loading = false;
  error = "";

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   * @param {EcommerceEditService} _ecommerceEditService
   */
  constructor(
    private _ecommerceEditService: EcommerceEditService,
    private _ecommerceService: EcommerceService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeImage(event) {
    this.avatarImage = "";
  }

  changeColor(color: string) {
    this.currentRow.color = color;
  }

  /**
   * Submit
   *
   * @param form
   */
  submitProductEdit(form) {
    if (form.valid) {
      this.loading = true;
      const formVal = form.value;

      const tempProduct = {
        ...this.currentRow,
        image: this.avatarImage,
        name: formVal["productName"],
        brand: formVal["brand"],
        price: +formVal["price"],
        hasFreeShipping: formVal["availability"] == "true",
        categoery: formVal["productCategory"],
        isDisabled: formVal["status"] == "true",
        isStockAvailable: formVal["stock_available"] == "true",
        rating: formVal["rating"],
        color: this.currentRow.color,
        description: formVal["description"],
      };

      this._ecommerceService.onProductEditChange.next(tempProduct);
    } else {
      this.error = "Please select all required fields!";
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._ecommerceEditService.onEcommerceEditChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.currentRow = response;
        this.avatarImage = this.currentRow.image;
        this.tempRow = cloneDeep(this.currentRow);
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
