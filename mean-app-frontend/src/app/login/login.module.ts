import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class LoginModule { }
