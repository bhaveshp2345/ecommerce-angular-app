import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { of, BehaviorSubject, Observable, throwError, EMPTY } from "rxjs";
import {
  catchError,
  map,
  debounceTime,
  filter,
  switchMap,
} from "rxjs/operators";

@Injectable()
export class UserListService {
  public onNewUserListChange: BehaviorSubject<any>;
  public newUserList$: Observable<any>;

  public onAdminDeleteChange: BehaviorSubject<any>;
  public adminDelete$: Observable<any>;

  public onAdminCreateChange: BehaviorSubject<any>;
  public adminCreate$: Observable<any>;

  constructor(private _httpClient: HttpClient) {
    this.initializeUserList();
    this.initializeAdminDelete();
    this.initializeAdminCreate();
  }

  private initializeUserList() {
    this.onNewUserListChange = new BehaviorSubject(null);
    this.newUserList$ = this.onNewUserListChange.asObservable().pipe(
      debounceTime(200),
      filter((item) => item != null),
      switchMap((product) =>
        this.getDataTableRows(product).pipe(
          catchError((err) => {
            return of(err);
          }),
          filter((item: any) => item.status == 1),
          map((pagedData: any) => {
            return this.mapTableData(pagedData);
          })
        )
      )
    );
  }

  private initializeAdminDelete() {
    this.onAdminDeleteChange = new BehaviorSubject(null);
    this.adminDelete$ = this.onAdminDeleteChange.asObservable().pipe(
      debounceTime(200),
      filter((item) => item != null),
      switchMap((adminId) =>
        this.deleteAdmin(adminId).pipe(
          catchError((err) => {
            return of(err);
          })
        )
      )
    );
  }

  private initializeAdminCreate() {
    this.onAdminCreateChange = new BehaviorSubject(null);
    this.adminCreate$ = this.onAdminCreateChange.asObservable().pipe(
      debounceTime(200),
      filter((item) => item != null),
      switchMap((adminBody) =>
        this.registerNewUser(adminBody).pipe(
          catchError((err) => {
            return of(err);
          })
        )
      )
    );
  }

  private getDataTableRows(userParams: any) {
    return this._httpClient.get(`${environment.apiUrl}/admin/admin-list`, {
      params: userParams,
    });
  }

  private registerNewUser(userBody: any) {
    return this._httpClient.post(
      `${environment.apiUrl}/admin/createAdmin`,
      userBody
    );
  }

  private deleteAdmin(adminId: string) {
    return this._httpClient.put(
      `${environment.apiUrl}/admin/deleteAdmin/${adminId}`,
      {}
    );
  }

  private mapTableData(pagedData) {
    const page = {
      totalPages: pagedData?.data?.adminUsersCount || 1,
      totalElements: pagedData?.data?.adminUsersCount || 1,
    };
    const rows = pagedData?.data?.adminList || [];
    return { rows, page };
  }
}
