import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PostsRoutingModule } from './posts-routing.module';


@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
    SpinnerComponent
  ],
  imports: [
    PostsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
  ]
})
export class PostsModule {
}
