import { CoreMenu } from "@core/types";

export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "MENU.DASHBOARD.COLLAPSIBLE",
    type: "collapsible",
    icon: "home",
    badge: {
      title: "2",
      translate: "MENU.DASHBOARD.BADGE",
      classes: "badge-light-warning badge-pill",
    },
    children: [
      {
        id: "analytics",
        title: "Analytics",
        translate: "MENU.DASHBOARD.ANALYTICS",
        type: "item",
        role: ["Admin"],
        icon: "circle",
        url: "dashboard/analytics",
      },
    ],
  },
  // Apps & Pages
  {
    id: "apps",
    type: "section",
    title: "Apps & Pages",
    translate: "MENU.APPS.SECTION",
    icon: "package",
    children: [
      {
        id: "e-commerce",
        title: "eCommerce",
        translate: "MENU.APPS.ECOMMERCE.COLLAPSIBLE",
        type: "collapsible",
        icon: "shopping-cart",
        children: [
          {
            id: "shop",
            title: "Shop",
            translate: "MENU.APPS.ECOMMERCE.SHOP",
            type: "item",
            icon: "circle",
            url: "apps/e-commerce/shop",
          },
          {
            id: "details",
            title: "Details",
            translate: "MENU.APPS.ECOMMERCE.DETAIL",
            type: "item",
            icon: "circle",
            url: "apps/e-commerce/details",
          },
          {
            id: "wishList",
            title: "Wish List",
            translate: "MENU.APPS.ECOMMERCE.WISHLIST",
            type: "item",
            icon: "circle",
            url: "apps/e-commerce/wishlist",
          },
          {
            id: "checkout",
            title: "Checkout",
            translate: "MENU.APPS.ECOMMERCE.CHECKOUT",
            type: "item",
            icon: "circle",
            url: "apps/e-commerce/checkout",
          },
        ],
      },
    ],
  },
];
