import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../login-service/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private _loginService:LoginService,private _router:Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      const isLoggedIn:boolean = this._loginService.isLoggedIn;

      if(isLoggedIn===true){
        return true;
      }
      else{
        this._router.navigate(['/login']);
        return false;
      }
  }
}
