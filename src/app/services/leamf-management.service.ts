import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeamfManagementService {
  nameValidators(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbiddenCharacters =
        control.value && /[!@#$%^&*(),.?":{}|<>]/.test(control.value.trim());
      const maxLengthExceeded =
        control.value && control.value.trim().length > 255;
      const containWhitespace = control.value && control.value.trim() === '';

      if (maxLengthExceeded) {
        return { maxlength: true };
      }

      if (forbiddenCharacters) {
        return { forbiddenCharacter: true };
      }

      if (containWhitespace) {
        return { whitespace: true };
      }

      return null;
    };
  }

  checkNameExists(
    name: string,
    kpiEditNameInstant?: string
  ): Observable<boolean> {
    const listKPIName = ['abc', 'abcd', '1', 'dataset', 'rule', 'kpi'];
    let nameExists = listKPIName.includes(name.toLowerCase());
    if (
      kpiEditNameInstant &&
      kpiEditNameInstant.toLowerCase() === name.trim().toLowerCase()
    ) {
      nameExists = false;
    }
    console.log(nameExists);
    return of(nameExists);
  }

  unitValidators(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const maxLengthExceeded =
        control.value && control.value.trim().length > 100;
      const containWhitespace = control.value && control.value.trim() === '';

      if (maxLengthExceeded) {
        return { maxlength: true };
      }

      if (containWhitespace) {
        return { whitespace: true };
      }

      return null;
    };
  }

  textValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const maxLengthExceeded =
        control.value && control.value.trim().length > 255;
      const containWhitespace = control.value && control.value.trim() === '';

      if (maxLengthExceeded) {
        return { maxlength: true };
      }

      if (containWhitespace) {
        return { whitespace: true };
      }

      return null;
    };
  }

  octerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      // Check if the value is a number and between 0 and 255
      if (value !== null && value !== '') {
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0 || num > 255) {
          return { invalidOctet: { value } };
        }
      }

      return null; // Valid
    };
  }

  portValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      // Check if the value is a number and between 0 and 255
      if (value !== null && value !== '') {
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0 || num > 9999) {
          return { invalidPort: { value } };
        }
      }

      return null; // Valid
    };
  }
}
