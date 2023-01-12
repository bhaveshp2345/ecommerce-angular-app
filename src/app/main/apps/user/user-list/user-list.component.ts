import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { EMPTY, from, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";

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
  public temp = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public previousStatusFilter = "";
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

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
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
      limit: this.page.limit,
    };
    this.fetchTableData(this.allUserParams).subscribe();
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  changeStatusVal() {
    this.loading = true;
    if (!this.selectedStatus || !this.selectedStatus?.value) {
      delete this.allUserParams?.status;
    } else {
      this.allUserParams = {
        ...this.allUserParams,
        status: +this.selectedStatus?.value,
      };
    }

    return this.fetchTableData(this.allUserParams).subscribe();
  }

  changeRoleVal() {
    this.loading = true;
    if (!this.selectedRole || !this.selectedRole?.value) {
      delete this.allUserParams?.user_type;
    } else {
      this.allUserParams = {
        ...this.allUserParams,
        user_type: +this.selectedRole?.value,
      };
    }

    return this.fetchTableData(this.allUserParams).subscribe();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
        if (config.layout.animation === "zoomIn") {
          setTimeout(() => {
            this.setPage({ offset: 0 });
          }, 450);
        } else {
          this.setPage({ offset: 0 });
        }
      });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        switchMap((searchVal) => {
          this.loading = true;
          this.allUserParams = {
            ...this.allUserParams,
            search: searchVal,
          };
          return this.fetchTableData(this.allUserParams);
        })
      )
      .subscribe();
  }

  setPage(pageInfo) {
    this.loading = true;
    this.page.page = pageInfo.offset + 1;
    this.allUserParams = {
      ...this.allUserParams,
      page: this.page.page,
      limit: this.page.limit,
    };
    this.fetchTableData(this.allUserParams).subscribe();
  }

  onSort(event) {
    // event was triggered, start sort sequence
    this.loading = true;
    const sort = event.sorts[0];
    this.allUserParams = {
      ...this.allUserParams,
      sortBy: sort.prop,
    };
    this.fetchTableData(this.allUserParams).subscribe();
  }

  fetchTableData(userParams) {
    return this._userListService.getDataTableRows(userParams).pipe(
      catchError((err) => {
        this.mapTableData(null);
        this.loading = false;
        return of();
      }),
      tap((pagedData: any) => {
        if (pagedData.status == 1) this.mapTableData(pagedData);
        this.loading = false;
      })
    );
  }

  mapTableData(pagedData) {
    this.page.page = pagedData?.data?.page || 1;
    this.page.totalPages = pagedData?.data?.total || 1;
    this.page.totalElements = pagedData?.data?.total || 1;
    this.page = { ...this.page };
    this.rows = pagedData?.data?.data || [];
    this.tempData = this.rows;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
