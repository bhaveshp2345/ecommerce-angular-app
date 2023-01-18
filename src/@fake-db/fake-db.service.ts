import { InMemoryDbService } from "angular-in-memory-web-api";

import { accountSettingsFakeData } from "@fake-db/account-settings.data";
import { DashboardFakeData } from "@fake-db/dashboard.data";
import { EcommerceFakeData } from "@fake-db/ecommerce.data";
import { ProfileFakeData } from "@fake-db/profile.data";

export class FakeDbService implements InMemoryDbService {
  createDb(): any {
    return {
      // Account Settings
      "account-settings-data": accountSettingsFakeData.data,

      // Profile
      "profile-data": ProfileFakeData.data,

      // E-Commerce
      "ecommerce-products": EcommerceFakeData.products,
      "ecommerce-relatedProducts": EcommerceFakeData.relatedProducts,
      "ecommerce-userWishlist": EcommerceFakeData.userWishlist,
      "ecommerce-userCart": EcommerceFakeData.userCart,

      // Dashboard
      "dashboard-data": DashboardFakeData.data,
    };
  }
}
