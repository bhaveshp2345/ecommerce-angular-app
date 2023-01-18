import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { SwiperConfigInterface } from "ngx-swiper-wrapper";

import { EcommerceService } from "app/main/apps/ecommerce/ecommerce.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-ecommerce-details",
  templateUrl: "./ecommerce-details.component.html",
  styleUrls: ["./ecommerce-details.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "ecommerce-application" },
})
export class EcommerceDetailsComponent implements OnInit {
  // public
  public contentHeader: object;
  public product;
  public wishlist;
  public cartList;
  public relatedProducts;
  public url = this.router.url;
  public lastValue;
  productColors = [
    { color: "orange", child: "bg-primary", parent: "b-primary" },
    { color: "green", child: "bg-success", parent: "b-success" },
    { color: "red", child: "bg-danger", parent: "b-danger" },
    { color: "blue", child: "bg-info", parent: "b-info" },
  ];
  selectedColor = "green";

  isProductDisabled = false;

  // Swiper
  public swiperResponsive: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };

  /**
   * Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(
    private router: Router,
    private _ecommerceService: EcommerceService
  ) {
    this.lastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  toggleProductStatus() {
    this.isProductDisabled = !this.isProductDisabled;
  }

  changeColor(color) {
    this.selectedColor = color;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to Selected Product change
    this._ecommerceService.onSelectedProductChange.subscribe((res) => {
      this.product = res[0];
    });

    // Get Related Products
    this._ecommerceService.getRelatedProducts().then((response) => {
      this.relatedProducts = response;
    });

    // content header
    this.contentHeader = {
      headerTitle: "Product Details",
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
            link: "/",
          },
          {
            name: "Details",
            isLink: false,
          },
        ],
      },
    };
  }
}
