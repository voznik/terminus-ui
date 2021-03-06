import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatCheckboxModule,
} from '@angular/material';

import { TsCheckboxComponent } from './checkbox.component';
export { TsCheckboxComponent } from './checkbox.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
  ],
  exports: [
    TsCheckboxComponent,
  ],
  declarations: [
    TsCheckboxComponent,
  ],
})
export class TsCheckboxModule {}
