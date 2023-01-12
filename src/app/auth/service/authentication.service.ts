import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "environments/environment";
import { User, Role } from "app/auth/models";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Admin
    );
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Client
    );
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/users/login`, {
        email,
        password,
        user_type: "2",
        platform_os: 1,
      })
      .pipe(
        map((user) => {
          user = user.data;
          // login successful if there's a jwt token in the response
          if (user && user.auth_toekn) {
            user.role = user.user_type == 1 ? Role.Client : Role.Admin;
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));

            // Display welcome toast!

            setTimeout(() => {
              this._toastrService.success(
                "You have successfully logged in as an " +
                  user.role +
                  " user to Tridhya. Now you can start to explore. Enjoy! 🎉",
                "👋 Welcome, " + user.first_name + "!",
                {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  register(userObject: any) {
    return this._http
      .post<any>(`${environment.apiUrl}/users/signUp`, userObject)
      .pipe(
        map((user) => {
          user = user.data;
          if (user) {
            user.role = user.user_type == 1 ? Role.Client : Role.Admin;
            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                "You have successfully registerd in as an " +
                  user.role +
                  " user to Tridhya. Now you can start to explore. Enjoy! 🎉",
                "👋 Welcome, " + user.first_name + "!",
                {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                }
              );
            }, 4000);
          }

          return user;
        })
      );
  }

  forotPassword(email: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/users/forgot-password`, {
        email,
        user_type: "2",
      })
      .pipe(
        map((user) => {
          if (user.status == 1) {
            this._toastrService.success(
              "The forgot password email has been sent successfully!",
              "Send Email!",
              {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              }
            );
          }
          return user;
        })
      );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    // notify
    this.currentUserSubject.next(null);
  }
}
