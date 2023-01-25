import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { cloneDeep } from "lodash";

import { UserEditService } from "app/main/apps/user/user-edit/user-edit.service";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public currentRow;
  public avatarImage = "";
  public tempRow;
  // public rows;
  loading = false;
  error = "";

  @ViewChild("accountForm") accountForm: NgForm;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(
    private router: Router,
    private _userEditService: UserEditService
  ) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.currentRow);
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeAvatar() {
    this.avatarImage = "";
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
      const adminBody = {
        adminId: this.currentRow._id,
        email: formVal["email"],
        company: formVal["company"],
        first_name: formVal["first_name"],
        last_name: formVal["last_name"],
        address: formVal["address"],
        status: formVal["status"],
      };
      this._userEditService.onAdminEditChange.next(adminBody);
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._userEditService.onUserEditChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        if (response?.status == 1) {
          this.currentRow = response?.data;
          this.avatarImage = this.currentRow?.avatar;
          this.tempRow = cloneDeep(this.currentRow);
        }
      });

    this._userEditService.adminEdit$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.handleEditResponse(result);
      });
  }

  private handleEditResponse(result) {
    if (result?.status == 1) {
      this.loading = false;
      this.router.navigate(["/apps/user/user-view/" + this.currentRow._id]);
    } else {
      this.handleEditErr(result);
    }
  }

  private handleEditErr(err) {
    this.error = err?.error?.message || "Something went wrong!";
    this.loading = false;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._userEditService.onAdminEditChange.next(null);
  }
}
