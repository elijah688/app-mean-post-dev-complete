import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { LoginService } from './login-service/login.service';
import { MyErrorStateMatcher } from './login-service/login.error-state-matcher';
import { emailUnique } from './login-validator/login.validator';
import { Observable, Subject, Subscription } from 'rxjs';
import { User } from './login-models/user-model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

   hide = true;
   login = true;
   matcher:MyErrorStateMatcher = new MyErrorStateMatcher();
   loginSubject:Subject<boolean> = new Subject<boolean>();

   loginSubscription:Subscription = new Subscription();
   dialogRefSub:Subscription = new Subscription();
   signUpUser:Subscription = new Subscription();

   authForm = this.fb.group({
    username: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.email]
    ],
    password: ['', [
      Validators.required,
      Validators.minLength(6)]
    ],
  });

  @ViewChild("form", {static: false}) form: NgForm
  constructor(
     private fb: FormBuilder,
     private loginServ:LoginService,
     private dialog:MatDialog
  ) { }


    openDialog(email:string, umaruLine:string): void {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        height: '19.69rem',
        width: '24.06rem',
        data: {email:email, umaruLine:umaruLine}
      });

    this.dialogRefSub = dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.authForm.patchValue({username:result});
      });
    }

  ngOnInit() {
    this.handleFormChanges();
  }


  authenticate(){
    console.log(this.login);
    if(this.authForm.valid){
      const username = this.authForm.get('username').value;
      const password = this.authForm.get('password').value;
      const user: User = {
        username: username,
        password: password
      }
      if(this.login===true){
        this.loginServ.login(user);
      }
      else{
        this.signUpUser = this.loginServ.signUpUser(user).subscribe(res=>{
          this.loginSubject.next(true);
          this.login = true;

          const umaruLine:string = `This is your username, Onii-chan: ${username}`

          this.openDialog(username, umaruLine);
        });
      }

      this.form.reset();
      this.form.resetForm();
    }
  }

  showLogin(){
    this.loginSubject.next(this.login);
  }

ngOnDestroy(): void {
  this.loginSubscription.unsubscribe();
  this.dialogRefSub.unsubscribe();
  this.signUpUser.unsubscribe();
}

handleFormChanges() {
  this.loginSubscription = this.loginSubject.subscribe(login=>{
    if(login===true){
      this.authForm.get('username').clearAsyncValidators();
    }
    else{
      this.authForm.get('username').setAsyncValidators(emailUnique(this.loginServ, this.login));
    }
    this.authForm.get('username').updateValueAndValidity();
  });

}


}
