import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { Subject } from "rxjs";
import { debounceTime, takeUntil, tap } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

import { UserListService } from "app/main/apps/user/user-list/user-list.service";
import { Page } from "app/auth/models";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  page = new Page();
  // public selectedOption = 10;
  public ColumnMode = ColumnMode;
  loading = false;

  public selectStatus: any = [
    { name: "All", value: "" },
    { name: "Active", value: "1" },
    { name: "Inactive", value: "2" },
  ];

  public selectRole: any = [
    { name: "All", value: "" },
    { name: "Admin", value: "1" },
    { name: "Client", value: "2" },
  ];

  public selectedPlan = [];
  public selectedRole;
  public selectedStatus;
  public searchValue = "";

  searchControl = new FormControl("");

  allUserParams: any;
  error = "";

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _userListService: UserListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService
  ) {
    this._unsubscribeAll = new Subject();
    this.page.page = 1;
    this.page.limit = 10;
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  changePageLimit() {
    this.loading = true;
    this.allUserParams = {
      ...this.allUserParams,
      length: this.page.limit,
    };
    this._userListService.onNewUserListChange.next(this.allUserParams);
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  changeStatusVal() {
    this.loading = true;
    if (!this.selectedStatus || !this.selectedStatus?.value) {
      delete this.allUserParams?.filter;
    } else {
      this.allUserParams = {
        ...this.allUserParams,
        filter: this.selectedStatus?.value == "1" ? "active" : "deactive",
      };
    }
    this._userListService.onNewUserListChange.next(this.allUserParams);
  }

  deleteUser(adminId: string) {
    this.loading = true;
    this._userListService.onAdminDeleteChange.next(adminId);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._userListService.newUserList$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.handleTableDataResponse(result);
      });

    this._userListService.adminDelete$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.handleDeleteAdminResponse(result);
      });

    // Subscribe config change
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.setPage({ offset: 0 });
      });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        tap((searchVal) => {
          this.loading = true;
          this.allUserParams = {
            ...this.allUserParams,
            search: searchVal,
          };
          this._userListService.onNewUserListChange.next(this.allUserParams);
        })
      )
      .subscribe();
  }

  private handleTableDataResponse(result) {
    this.loading = false;
    if (result?.page) {
      this.page = { ...this.page, ...result.page };
      this.rows = result.rows;
    }
  }

  private handleDeleteAdminResponse(result) {
    if (result?.status == 1) {
      this.loading = false;
      this._userListService.onNewUserListChange.next(this.allUserParams);
    } else {
      this.error = result?.error?.message || "Something went wrong!";
      this.loading = false;
    }
  }

  setPage(pageInfo) {
    this.loading = true;
    this.page.page = pageInfo.offset + 1;
    this.allUserParams = {
      ...this.allUserParams,
      page: this.page.page,
      limit: this.page.limit,
    };
    this._userListService.onNewUserListChange.next(this.allUserParams);
  }

  onSort(event) {
    // event was triggered, start sort sequence
    this.loading = true;
    const sort = event.sorts[0];
    this.allUserParams = {
      ...this.allUserParams,
      sort: sort.prop,
      direction: sort.dir,
    };
    this._userListService.onNewUserListChange.next(this.allUserParams);
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
