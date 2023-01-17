import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Subject } from "rxjs";

@Component({
  selector: "app-ecommerce-edit",
  templateUrl: "./ecommerce-edit.component.html",
  styleUrls: ["./ecommerce-edit.component.scss"],
})
export class EcommerceEditComponent implements OnInit {
  // Public
  public avatarImage = "";
  productTitle;
  productBrand;
  productInStock;
  productPrice;
  productDeliveryCharge;
  productStatus;
  productDescription;
  productColors = [
    { color: "orange", child: "bg-primary", parent: "b-primary" },
    { color: "green", child: "bg-success", parent: "b-success" },
    { color: "red", child: "bg-danger", parent: "b-danger" },
    { color: "blue", child: "bg-info", parent: "b-info" },
  ];
  selectedColor = "green";
  loading = false;
  error = "";

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(private router: Router) {
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

  changeColor(color) {
    this.selectedColor = color;
  }
  /**
   * Submit
   *
   * @param form
   */
  submitProductEdit(form) {
    if (form.valid && this.avatarImage) {
      this.loading = true;
      const formVal = form.value;
      const productBody = {
        avatarImage: this.avatarImage,
        title: formVal["title"],
        brand: formVal["brand"],
        inStock: formVal["inStock"],
        price: formVal["price"],
        delivery_charge: formVal["delivery_charge"],
        status: formVal["status"],
        description: formVal["description"],
      };
      console.log("productBody", productBody);
      this.error = "No API found";
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {}

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}