import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { environment } from "environments/environment";

import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class UserListService {
  constructor(private _httpClient: HttpClient) {}

  getDataTableRows(userParams: any) {
    return this._httpClient.get(`${environment.apiUrl}/users/users-list`, {
      params: userParams,
    });
  }

  registerNewUser(userBody: any) {
    return this._httpClient.post(
      `${environment.apiUrl}/users/signUp`,
      userBody
    );
  }
}
