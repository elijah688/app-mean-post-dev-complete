import { LoginService } from '../login-service/login.service';
import { map } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';



export const emailUnique = (loginServ: LoginService, login:boolean) => {
  return (control: AbstractControl) => {
      return loginServ.checkEmailNotTaken(control.value).pipe(map(res => {
          return res.isUnique ? null : { emailTaken: true };
      }));
    }
  }
