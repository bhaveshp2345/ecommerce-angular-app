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
