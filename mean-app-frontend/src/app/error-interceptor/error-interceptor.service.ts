import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    private _router:Router,
    public _dialog: MatDialog
  ) { }


  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err=>{
        let error:string;
        let umaruQuote:string;

        if(err.status === 401){
          error = "Invalid Login"
          umaruQuote = "Wrong username or password, Onii-chan!"
        }

        else{
          error = "Something went wrong"
          umaruQuote = "The server is broken, Onii-chan!"
        }

        const dialogRef = this._dialog.open(ErrorDialogComponent, {
          height: '19.69rem',
          width: '24.06rem',
          data: {error: error, umaruQuote: umaruQuote}
        });

        return throwError(err);
      })
    );
  };
}
