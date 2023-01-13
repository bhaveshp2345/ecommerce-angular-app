import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { UserListService } from "../user-list.service";

@Component({
  selector: "app-new-user-sidebar",
  templateUrl: "./new-user-sidebar.component.html",
})
export class NewUserSidebarComponent implements OnInit {
  public firstname;
  public lastname;
  public email;
  public password;
  public passwordTextType: boolean;
  loading = false;
  error = "";

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _userListService: UserListService,
    private router: Router
  ) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {
      this.loading = true;
      const formVal = form.value;
      const userBody = {
        email: formVal["user-email"],
        password: formVal["user-password"],
        company: "Tridhya Tech",
        first_name: formVal["user-firstname"],
        last_name: formVal["user-lastname"],
      };
      this.registerNewUser(userBody).subscribe();
    }
  }

  registerNewUser(userBody: any) {
    return this._userListService.registerNewUser(userBody).pipe(
      catchError((err) => {
        this.error = err?.error?.message || "Something went wrong!";
        this.loading = false;
        return of();
      }),
      tap((pagedData: any) => {
        if (pagedData.status == 1) {
          this.toggleSidebar("new-user-sidebar");
        }
        this.loading = false;
      })
    );
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  ngOnInit(): void {}
}
