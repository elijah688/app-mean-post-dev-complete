import { NgModule } from '@angular/core';

import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ErrorDialogComponent } from './error-interceptor/error-dialog/error-dialog.component';
import { LoginDialogComponent } from './login/login-dialog/login-dialog.component';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  declarations: [
    ErrorDialogComponent,
    LoginDialogComponent,
    SnackbarComponent
  ],
  imports:[
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  entryComponents: [
      ErrorDialogComponent,
      LoginDialogComponent,
      SnackbarComponent
    ],

})
export class MaterialModule { }
