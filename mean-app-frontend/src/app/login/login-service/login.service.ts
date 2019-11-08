import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../login-models/user-model/user.model';
import { Token } from '../login-models/token-model/token.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';

const BACKEND_URL:string = environment.apiUrl +'/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _timer:ReturnType<typeof setTimeout>;
  private _isLoggedIn:boolean = false;
  private _isLoggedInSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _userIdSubject:BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private _router: Router,
    private http:HttpClient,
    private _snackBar: MatSnackBar
  ) { }


  signUpUser(user:User):Observable<{message:string}>{
     return this.http.post<{message:string}>(BACKEND_URL, user)
        .pipe(
          catchError(this.handleError)
        )

    }

    login(user:User):void{
      this.http.post<{token:string,id:string}>(`${BACKEND_URL}/login`, user).pipe(
        catchError(this.handleError)
      )
      .subscribe(res=>{
        const id:string = res.id;
        const tokenValue:string = res.token;
        const now:number = new Date().getTime();
        const expirationTime:number = now + 3600000;
        const expiresIn:string = (new Date(expirationTime).toISOString());

        const token:Token = {userId: id, tokenValue: tokenValue, expiresIn: expiresIn}
        this.storeToken(token);
        this._isLoggedIn = true;
        this._userIdSubject.next(id);
        this._isLoggedInSubject.next(true);
        this._router.navigate(['/posts']);


        this._snackBar.openFromComponent(SnackbarComponent, {
          duration: 2000,
          panelClass: "modal__purple",
          data: 'some data'
        });

      });
    }


  autoLogin(){
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("tokenValue");
    const expirationTime = localStorage.getItem("expirationTime");


    if(token === null || expirationTime === null || userId === null ){
      return
    }

    else{
      const expirationTimeToDate:number = new Date(expirationTime).getTime();
      const now = new Date().getTime();
      const expiresIn = expirationTimeToDate - now;
      console.log(expiresIn)
      if(expiresIn>0){
        this._timer = setTimeout(()=>{
          this.logOut();
        },expiresIn);

        this._isLoggedInSubject.next(true);
        this._isLoggedIn = true;
        this._userIdSubject.next(userId);
      }
      else{
        return
      }
    }
  }


logOut():void{
  localStorage.removeItem("userId");
  localStorage.removeItem("tokenValue");
  localStorage.removeItem("expirationTime");
  clearTimeout(this._timer);
  this._router.navigate(['/login']);
  this._isLoggedInSubject.next(false);
  this._isLoggedIn = false;
  this._userIdSubject.next(null);
}



storeToken(token:Token):void{
  const userId:string = token.userId;
  const tokenValue:string = token.tokenValue;
  const expiresIn:string = token.expiresIn;

  const now:number = new Date().getTime();
  const expiresInNumber = new Date(expiresIn).getTime()
  const timeout:number = new Date(expiresInNumber - now).getTime();

  localStorage.setItem("userId", userId);
  localStorage.setItem("tokenValue", JSON.stringify(tokenValue));
  localStorage.setItem("expirationTime", expiresIn);

  this._timer = setTimeout(()=>{
    this.logOut();
  },timeout)
}

  checkEmailNotTaken(email:string):Observable<{isUnique:boolean}>{
     return this.http.get<{isUnique:boolean}>(`${BACKEND_URL}/unique/${email}`)
       .pipe(
         catchError(this.handleError),
       )
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  };


  get isLoggedInSubject():Observable<boolean>{
    return this._isLoggedInSubject.asObservable();
  }

  get isLoggedIn():boolean{
    return this._isLoggedIn;
  }

  get userIdSubject(){
    return this._userIdSubject.asObservable();
  }

}
