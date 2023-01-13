import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class AccountSettingsService {
  rows: any;
  onSettingsChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onSettingsChanged = new BehaviorSubject({});
  }

  fetchUserData() {
    return this._httpClient.get<any>(`${environment.apiUrl}/users/profile`);
  }

  editUser(userObject: any) {
    return this._httpClient.put<any>(`${environment.apiUrl}/users`, userObject);
  }

  userChangePass(changePassObject: any) {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/users/change-password`,
      changePassObject
    );
  }
}
