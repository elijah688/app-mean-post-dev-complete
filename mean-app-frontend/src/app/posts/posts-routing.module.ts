import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { AuthGuardService } from '../login/login-auth-guard/auth-guard.service';


const routes: Routes = [
  { path: '', component:  PostListComponent,
    children:[
      { path: '', component:  PostCreateComponent, canActivate: [AuthGuardService]},
      { path: ':id', component: PostCreateComponent, canActivate: [AuthGuardService] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
