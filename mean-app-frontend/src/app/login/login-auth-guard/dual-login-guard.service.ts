import { Injectable } from '@angular/core';
import { LoginService } from '../login-service/login.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DualLoginGuardService implements CanActivate {
  constructor(private _loginService:LoginService,private _router:Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      const isLoggedIn:boolean = this._loginService.isLoggedIn;

      if(isLoggedIn===false){
        return true;
      }
      else{
        this._router.navigate(['/posts']);
        return false;
      }
  }
}
