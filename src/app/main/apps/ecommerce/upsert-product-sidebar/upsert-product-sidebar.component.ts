import { Component, OnInit } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { EcommerceService } from "../ecommerce.service";
import { of } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Component({
  selector: "app-upsert-product-sidebar",
  templateUrl: "./upsert-product-sidebar.component.html",
})
export class UpsertProductSidebarComponent implements OnInit {
  public image;
  public title;
  public brand;
  public price;
  public description;
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

  submit(form) {
    if (form.valid) {
      this.loading = true;
      const formVal = form.value;
      const productBody = {
        image: formVal["image"],
        title: formVal["title"],
        brand: formVal["brand"],
        price: formVal["price"],
        description: formVal["description"],
      };
      this.registerNewProduct(productBody).subscribe();
    }
  }

  registerNewProduct(productBody: any) {
    return this._ecommerceService.registerNewProduct(productBody).pipe(
      catchError((err) => {
        this.error = err?.error?.message || "Something went wrong!";
        this.loading = false;
        return of();
      }),
      tap((data: any) => {
        if (data.status == 1) {
          this.toggleSidebar("upsert-product-sidebar");
        }
        this.loading = false;
      })
    );
  }
}
