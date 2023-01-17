import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { SwiperConfigInterface } from "ngx-swiper-wrapper";

import { EcommerceService } from "app/main/apps/ecommerce/ecommerce.service";

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
  constructor(private _ecommerceService: EcommerceService) {}

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
