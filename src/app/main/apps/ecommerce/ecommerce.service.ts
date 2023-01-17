import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class EcommerceService {
  // Public
  public productList: Array<any>;
  public wishlist: Array<any>;
  public cartList: Array<any>;
  public selectedProduct;
  public relatedProducts;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {}

  registerNewProduct(productBody: any) {
    return this._httpClient.post(
      `${environment.apiUrl}/products/add`,
      productBody
    );
  }
}
