import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";

import { Subject, of } from "rxjs";
import { catchError, tap, takeUntil } from "rxjs/operators";
import { FlatpickrOptions } from "ng2-flatpickr";

import { AccountSettingsService } from "app/main/pages/account-settings/account-settings.service";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  confirmPassValidator,
  passValidators,
  phoneValidators,
} from "app/main/main-constants";
@Component({
  selector: "app-account-settings",
  templateUrl: "./account-settings.component.html",
  styleUrls: ["./account-settings.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public avatarImage: string;
  public error = "";
  public submitted = false;
  public loading = false;

  public generalSettingsForm: UntypedFormGroup;

  public changePassForm: UntypedFormGroup;

  public informationForm: UntypedFormGroup;

  public selectCountry: any = [
    { name: "USA", value: "+1" },
    { name: "India", value: "+91" },
    { name: "Canada", value: "+44" },
  ];

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
  constructor(
    private _accountSettingsService: AccountSettingsService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
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

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.prepareGeneralSettingForm();
    this.preparePasswordSettingForm();
    this.prepareInfoSettingForm();
    this.getUserData();

    // content header
    this.contentHeader = {
      headerTitle: "Account Settings",
      actionButton: false,
      breadcrumb: {
        type: "",
        links: [],
      },
    };
  }

  //#region Get user data
  getUserData() {
    this.submitted = false;
    this.loading = true;
    this._accountSettingsService
      .fetchUserData()
      .pipe(
        catchError((err) => {
          this.error = err?.error?.message || "Something went wrong!";
          this.loading = false;
          return of();
        }),
        tap((result: any) => {
          if (result.status == 1) {
            this.setGeneralFormValue(result.data);
            this.setInfoFormValue(result.data);
            this.avatarImage = result.data.profile_image;
          }
          this.loading = false;
        })
      )
      .subscribe();
  }
  //#endregion

  //#region General Settings
  private prepareGeneralSettingForm() {
    this.generalSettingsForm = this._formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      company: ["", Validators.required],
    });
  }

  private setGeneralFormValue(data) {
    this.generalF.firstName.setValue(data.first_name);
    this.generalF.lastName.setValue(data.last_name);
    this.generalF.email.setValue(data.email);
    this.generalF.company.setValue(data.company);
  }

  get generalF() {
    return this.generalSettingsForm.controls;
  }

  onGeneralSettingSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.generalSettingsForm.invalid || !this.avatarImage) {
      return;
    }

    // Login
    this.loading = true;
    const editUserBody = {
      first_name: this.generalF.firstName.value,
      last_name: this.generalF.lastName.value,
      email: this.generalF.email.value,
      company: this.generalF.company.value,
      profile_image: this.avatarImage,
    };
    this._accountSettingsService
      .editUser(editUserBody)
      .pipe(
        catchError((err) => {
          this.error = err?.error?.message || "Something went wrong!";
          this.loading = false;
          return of();
        }),
        tap((result: any) => {
          if (result.status == 1) {
            this._router.navigate(["/"]);
          }
          this.loading = false;
        })
      )
      .subscribe();
  }
  //#endregion

  //#region Change password Settings
  private preparePasswordSettingForm() {
    this.changePassForm = this._formBuilder.group(
      {
        old_password: ["", Validators.required],
        new_password: [
          "",
          [Validators.required, Validators.pattern(passValidators)],
        ],
        confirm_password: [
          "",
          [Validators.required, Validators.pattern(passValidators)],
        ],
      },
      { validators: confirmPassValidator }
    );
  }

  get changePassF() {
    return this.changePassForm.controls;
  }

  onChangePassSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.changePassForm.invalid) {
      return;
    }

    // Login
    this.loading = true;
    const changePassBody = {
      old_password: this.changePassF.old_password.value,
      new_password: this.changePassF.new_password.value,
      confirm_password: this.changePassF.confirm_password.value,
    };

    this._accountSettingsService
      .userChangePass(changePassBody)
      .pipe(
        catchError((err) => {
          this.error = err?.error?.message || "Something went wrong!";
          this.loading = false;
          return of();
        }),
        tap((result: any) => {
          if (result.status == 1) {
            this._router.navigate(["/"]);
          }
          this.loading = false;
        })
      )
      .subscribe();
  }
  //#endregion

  //#region information settings
  private prepareInfoSettingForm() {
    this.informationForm = this._formBuilder.group({
      address: ["", [Validators.required]],
      country_code: ["", [Validators.required]],
      mobile_number: [
        "",
        [Validators.required, Validators.pattern(phoneValidators)],
      ],
    });
  }

  private setInfoFormValue(data) {
    this.infoF.address.setValue(data?.address);
    this.infoF.country_code.setValue(data?.country_code);
    this.infoF.mobile_number.setValue(data?.mobile_number);
  }

  get infoF() {
    return this.informationForm.controls;
  }

  onInfoSettingSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.informationForm.invalid) {
      return;
    }

    // Login
    this.loading = true;
    const infoUserBody = {
      address: this.infoF.address.value,
      "contact_details.country_code": this.infoF.country_code.value,
      "contact_details.mobile_number": this.infoF.mobile_number.value,
    };

    this._accountSettingsService
      .editUser(infoUserBody)
      .pipe(
        catchError((err) => {
          this.error = err?.error?.message || "Something went wrong!";
          this.loading = false;
          return of();
        }),
        tap((result: any) => {
          if (result.status == 1) {
            this._router.navigate(["/"]);
          }
          this.loading = false;
        })
      )
      .subscribe();
  }

  //#endregion

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
