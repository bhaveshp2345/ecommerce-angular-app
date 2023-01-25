import { Component, OnInit } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
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

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _userListService: UserListService
  ) {
    this._unsubscribeAll = new Subject();
  }

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
        company: "Tridhya",
        first_name: formVal["user-firstname"],
        last_name: formVal["user-lastname"],
        user_type: 1,
      };
      this._userListService.onAdminCreateChange.next(userBody);
    }
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  ngOnInit(): void {
    this._userListService.adminCreate$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.handleCreateResponse(result);
      });
  }

  private handleCreateResponse(result) {
    if (result?.status == 1) {
      this.toggleSidebar("new-user-sidebar");
      this._userListService.onNewUserListChange.next({});
      this.loading = false;
    } else {
      this.handleCreateErr(result);
    }
  }

  private handleCreateErr(err) {
    this.error = err?.error?.message || "Something went wrong!";
    this.loading = false;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._userListService.onAdminCreateChange.next(null);
  }
}
