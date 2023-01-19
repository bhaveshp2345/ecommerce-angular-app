import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passValidators =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export const phoneValidators =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const confirmPassValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const new_password = control.get("new_password").value;
  const confirm_password = control.get("confirm_password").value;

  return new_password !== confirm_password ? { matching: true } : null;
};

export enum MultiRange {
  ALL = "all",
  LESS_EQ_10 = "Less than equal to 10",
  FROM_10_TO_100 = "from 10 to 100",
  FROM_100_TO_500 = "from 100 to 500",
  GREAT_EQ_500 = "Greater than equal to 500",
}

export interface PriceRange {
  min: number;
  max: number;
}

export enum Categories {
  APPLIANCES = "appliances",
  AUDIO = "audio",
  CAMERAS_CAMCORDERS = "Cameras & Camcorders",
  CAR_ELECTRONICS_GPS = "Car Electronics & GPS",
  CELL_PHONES = "Cell Phones",
  COMPUTERS_TABLETS = "Computers & Tablets",
  HEALTH_FITNESS_BEAUTY = "Health, Fitness & Beauty",
  OFFICE_SCHOOL_SUPPLIES = "Office & School Supplies",
  TV_HOME_THEATER = "TV & Home Theater",
  VIDEO_GAMES = "Video Games",
}

export enum Brands {
  APPLE = "Apple",
  ONEODIO = "OneOdio",
  SHARP = "Sharp",
  GOOGLE = "Google",
  PHILIPS = "Philips",
  LOGITECH = "Logitech",
  NIKE = "Nike",
  BUGANI = "Bugani",
  SONY = "Sony",
  TAS = "TAS",
  ADIDAS = "Adidas",
}

export interface FilterList {
  multiRange: MultiRange;
  priceRangeFilter: PriceRange;
  categories: Categories;
  brands: Brands[];
  ratings: number;
}
