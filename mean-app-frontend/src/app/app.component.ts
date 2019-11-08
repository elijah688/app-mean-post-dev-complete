import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoginService } from './login/login-service/login.service';
import { Subscription } from 'rxjs';
import { MatSidenavContainer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn:boolean;
  isLoggedInSubs:Subscription = new Subscription();
  @ViewChild(("sidenav"), {static: false}) sideNav:MatSidenavContainer;

  constructor(
    private loginService:LoginService,
  ) { }

  ngOnInit() {
    this.isLoggedInSubs = this.isLoggedInSubs = this.loginService.isLoggedInSubject.subscribe(
      isLoggedIn=>{
        this.isLoggedIn = isLoggedIn;
    });

    this.loginService.autoLogin();

  }



   ngOnDestroy(): void {
     this.isLoggedInSubs.unsubscribe()
   }

   logOut(){
     this.loginService.logOut();
   }



}
