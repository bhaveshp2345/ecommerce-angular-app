import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { cloneDeep } from "lodash";
import { EcommerceEditService } from "./ecommerce-edit.service";

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
  productDeliveryCharge = 10;
  productStatus = 1;
  productColors = [
    { color: "orange", child: "bg-primary", parent: "b-primary" },
    { color: "green", child: "bg-success", parent: "b-success" },
    { color: "red", child: "bg-danger", parent: "b-danger" },
    { color: "blue", child: "bg-info", parent: "b-info" },
  ];
  selectedColor = "green";
  productRating = 4;
  loading = false;
  error = "";

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   * @param {EcommerceEditService} _ecommerceEditService
   */
  constructor(private _ecommerceEditService: EcommerceEditService) {
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
    this.selectedColor = color;
  }

  /**
   * Submit
   *
   * @param form
   */
  submitProductEdit(form) {
    // if (form.valid) {
    //   if (
    //     this.avatarImage &&
    //     this.productRating != null &&
    //     this.selectedColor
    //   ) {
    //     this.loading = true;
    //     const formVal = form.value;
    //     const productBody = {
    //       rating: this.productRating,
    //       avatarImage: this.avatarImage,
    //       title: formVal["title"],
    //       brand: formVal["brand"],
    //       inStock: formVal["availability"],
    //       price: formVal["price"],
    //       delivery_charge: formVal["delivery_charge"],
    //       status: formVal["status"],
    //       description: formVal["description"],
    //       color: this.selectedColor,
    //     };
    //     this.error = "No API found";
    //   } else {
    //     this.error = "All fields are required";
    //   }
    // }
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
