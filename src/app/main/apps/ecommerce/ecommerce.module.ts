import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { NouisliderModule } from "ng2-nouislider";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  SwiperConfigInterface,
  SwiperModule,
  SWIPER_CONFIG,
} from "ngx-swiper-wrapper";

import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { CoreTouchspinModule } from "@core/components/core-touchspin/core-touchspin.module";

import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

import { EcommerceDetailsComponent } from "app/main/apps/ecommerce/ecommerce-details/ecommerce-details.component";
import { EcommerceItemComponent } from "app/main/apps/ecommerce/ecommerce-item/ecommerce-item.component";
import { EcommerceShopComponent } from "app/main/apps/ecommerce/ecommerce-shop/ecommerce-shop.component";
import { EcommerceSidebarComponent } from "app/main/apps/ecommerce/ecommerce-shop/sidebar/sidebar.component";
import { UpsertProductSidebarComponent } from "./upsert-product-sidebar/upsert-product-sidebar.component";
import { EcommerceEditComponent } from "./ecommerce-edit/ecommerce-edit.component";
import { EcommerceService } from "./ecommerce.service";
import { EcommerceEditService } from "./ecommerce-edit/ecommerce-edit.service";

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: "horizontal",
  observer: true,
};

// routing
const routes: Routes = [
  {
    path: "shop",
    component: EcommerceShopComponent,
    resolve: {
      ecommerce: EcommerceService,
    },
    data: { animation: "EcommerceShopComponent" },
  },
  {
    path: "details/:id",
    component: EcommerceDetailsComponent,
    resolve: {
      ecommerce: EcommerceService,
    },
    data: { animation: "EcommerceDetailsComponent" },
  },
  {
    path: "details",
    redirectTo: "/apps/e-commerce/details/27", //Redirection
    data: { animation: "EcommerceDetailsComponent" },
  },
  {
    path: "edit/:id",
    component: EcommerceEditComponent,
    resolve: {
      ecommerce: EcommerceEditService,
    },
    data: { animation: "EcommerceEditComponent" },
  },
  {
    path: "edit",
    redirectTo: "/apps/e-commerce/details/27", //Redirection
    data: { animation: "EcommerceDetailsComponent" },
  },
];

@NgModule({
  declarations: [
    EcommerceShopComponent,
    EcommerceSidebarComponent,
    EcommerceDetailsComponent,
    EcommerceItemComponent,
    EcommerceEditComponent,
    UpsertProductSidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SwiperModule,
    FormsModule,
    CoreTouchspinModule,
    ContentHeaderModule,
    CoreSidebarModule,
    CoreCommonModule,
    NgbModule,
    NouisliderModule,
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
    EcommerceEditService,
  ],
})
export class EcommerceModule {}
