import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { PostService } from "../post-services/post.service"
import { Subscription } from 'rxjs';
import { Post } from './post-model/post.model';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login-service/login.service';
import { PostSocketService, SocketResolverAction, SocketResolverActionType } from '../post-socket-service/post-socket.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  colors: string[] = [];
  loading: boolean = true;
  editing: boolean = false;
  length: number = 0;
  pageSize: number = 2;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  currentPage: number = 1;
  userId:string;

  postSubListStatusSub: Subscription  = new Subscription();
  loadingSub: Subscription  = new Subscription();
  userIdSub: Subscription  = new Subscription();
  postSocetSub: Subscription  = new Subscription();
  constructor(
    private postService:PostService,
    private router:Router,
    private loginsService:LoginService,
    private socketService: PostSocketService) { }

  ngOnInit() {
    this.postSubListStatusSub = this.postService.postListStatusSubject.subscribe(postStatus=>{
      this.posts = postStatus.posts;
      this.length = postStatus.count;

      for (let post of this.posts) {
        const color:string = this.postService.randomColor();
          this.colors.push(color);
      }
    });


    this.userIdSub = this.loginsService.userIdSubject.subscribe(userId=>{
      this.userId = userId;
    });

    this.loadingSub = this.postService.loadingSubject.subscribe(loading=>{
      this.loading = loading;
    });

    this.postSocetSub = this.socketService.onNewPostAction()
      .subscribe(
        (socetResolverAction:SocketResolverAction)=>{
          let post:Post;
          let postIndex:number;
          let count: number;
          switch (socetResolverAction.type) {
            case SocketResolverActionType.Create:
              post = socetResolverAction.data.posts[0];
              count = socetResolverAction.data.count;
              this.posts.push(post);
              this.length = count;
              break;
            case SocketResolverActionType.Update:
              post = socetResolverAction.data.posts[0];
              postIndex = this.posts.map(p=>p.id).indexOf(post.id);
              this.posts[postIndex] = post;
              break;
            case SocketResolverActionType.Delete:
              post = socetResolverAction.data.posts[0];
              count = socetResolverAction.data.count;
              postIndex = this.posts.map(p=>p.id).indexOf(post.id);
              this.posts.splice(postIndex,1);
              this.length = count;
              break;
            default:
              return
            }
        });


    this.postService.getPosts(this.pageSize, this.currentPage);

  }

  removePost(id:string){
    this.postService.removePost(id).subscribe(res=>{
        this.postService.getPosts(this.pageSize, this.currentPage);
    });

  }

  editPost(p:Post){
    console.log(p.id);
    this.router.navigate([`/posts/${p.id}`]);
  }

  onPageChange(event:PageEvent){
    this.currentPage  = event.pageIndex+1;
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.pageSize, this.currentPage);
  }
  ngOnDestroy(): void {
    this.postSubListStatusSub.unsubscribe();
    this.loadingSub.unsubscribe();
    this.userIdSub.unsubscribe();
    this.postSocetSub.unsubscribe();
  }

  getRandomColor(){
    return this.postService.randomColor();
  }

}
