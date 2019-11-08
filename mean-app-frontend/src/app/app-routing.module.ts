import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DualLoginGuardService } from './login/login-auth-guard/dual-login-guard.service';

const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate:[DualLoginGuardService] },
  { path: 'posts', loadChildren: './posts/posts.module#PostsModule' },
  { path: '**', redirectTo: 'posts' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
