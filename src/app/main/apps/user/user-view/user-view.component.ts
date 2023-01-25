import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { UserViewService } from "app/main/apps/user/user-view/user-view.service";
import { UserListService } from "../user-list/user-list.service";

@Component({
  selector: "app-user-view",
  templateUrl: "./user-view.component.html",
  styleUrls: ["./user-view.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserViewComponent implements OnInit, OnDestroy {
  // public
  public url = this.router.url;
  public lastValue;
  public data;
  loading = false;
  error = "";

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserViewService} _userViewService
   */
  constructor(
    private router: Router,
    private _userViewService: UserViewService,
    private _userListService: UserListService
  ) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  deleteUser() {
    this.loading = true;
    this._userListService.onAdminDeleteChange.next(this.data._id);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._userViewService.onUserViewChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        if (response?.status == 1) {
          this.data = response?.data;
        }
      });

    this._userListService.adminDelete$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.handleDeleteAdminResponse(result);
      });
  }

  private handleDeleteAdminResponse(result) {
    if (result?.status == 1) {
      this.loading = false;
      this.router.navigate(["/apps/user/user-list"]);
    } else {
      this.error = result?.error?.message || "Something went wrong!";
      this.loading = false;
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._userListService.onAdminDeleteChange.next(null);
  }
}
