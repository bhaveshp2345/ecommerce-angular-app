import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { environment } from "environments/environment";

import { of, BehaviorSubject, Observable } from "rxjs";
import { catchError, debounceTime, filter, switchMap } from "rxjs/operators";

@Injectable()
export class UserEditService implements Resolve<any> {
  public apiData: any;
  public onUserEditChanged: BehaviorSubject<any>;

  public onAdminEditChange: BehaviorSubject<any>;
  public adminEdit$: Observable<any>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserEditChanged = new BehaviorSubject({});
    this.initializeAdminEdit();
  }

  private initializeAdminEdit() {
    this.onAdminEditChange = new BehaviorSubject(null);
    this.adminEdit$ = this.onAdminEditChange.asObservable().pipe(
      debounceTime(200),
      filter((item) => item != null),
      switchMap((adminBody) =>
        this.editAdminDetails(adminBody).pipe(
          catchError((err) => {
            return of(err);
          })
        )
      )
    );
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    let currentId = route.paramMap.get("id");
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData(currentId)]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get API Data
   */
  getApiData(id: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(`${environment.apiUrl}/admin/getAdminProfile/${id}`)
        .subscribe((response: any) => {
          this.apiData = response;
          this.onUserEditChanged.next(this.apiData);
          resolve(this.apiData);
        }, reject);
    });
  }

  editAdminDetails(adminBody: any) {
    return this._httpClient.put(
      `${environment.apiUrl}/admin/editAdmin/${adminBody.adminId}`,
      adminBody
    );
  }
}
