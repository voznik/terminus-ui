import { Injectable } from '@angular/core';


@Injectable()
export class ValidationServiceMock {

  getValidatorErrorMessage = jasmine.createSpy('getValidatorErrorMessage');

  creditCardValidator = jasmine.createSpy('creditCardValidator');

  emailValidator = jasmine.createSpy('emailValidator');

  passwordValidator = jasmine.createSpy('passwordValidator');

}