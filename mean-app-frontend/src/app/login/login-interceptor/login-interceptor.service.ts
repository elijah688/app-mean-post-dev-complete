import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LoginInterceptorService implements HttpInterceptor {
  constructor(
    private _router: Router
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    const storedUser = localStorage.getItem('tokenValue');
    const token = storedUser ? JSON.parse(storedUser) : null;

    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          token
        )
      });
      return next.handle(clonedReq);
    }
    else{
      return next.handle(req);
    }

  }
}
