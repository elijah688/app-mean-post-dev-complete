import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Post } from '../post-list/post-model/post.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const BACKEND_URL:string = environment.apiUrl +'/posts';

export interface PostListStatus{
  count:number;
  posts:Post[];
}
@Injectable({
  providedIn: 'root'
})
export class PostService {

  private _posts:Post[] = [];
  private _postListStatusSubject:Subject<PostListStatus> = new Subject<PostListStatus>()
  private _loadingSubject:Subject<boolean> = new Subject<boolean>()

constructor(private http:HttpClient) { }


addPost(title:string, content:string, image:File): Observable<{
  message:string,
  id:string,
  imagePath:string,
  count:number}>{
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("image", image, title);

  return this.http.post<{message:string, id:string, imagePath:string, count:number}>(BACKEND_URL, formData)
  }


editPost(post:Post){
  console.log('editing');
  let reqData :Post | FormData;

  if(typeof(post.imagePath)==='string'){
    reqData = {
      id: post.id,
      title: post.title,
      content: post.content,
      imagePath: post.imagePath,
      creator: null
      }
    }

    if(typeof(post.imagePath)==='object'){
      reqData = new FormData();
      reqData.append("id", post.id);
      reqData.append("title" ,post.title);
      reqData.append("content", post.content);
      reqData.append("image", post.imagePath, post.title);
    }

  return this.http.patch<{message:string,imagePath:string}>(`${BACKEND_URL}/edit/:id`,reqData)
}

getPosts(pageSize:number,currentPage:number){
  const queryParams = `?pagesize=${pageSize}&current=${currentPage}`
  const url = BACKEND_URL + queryParams;


  return  this.http.get<{
    message: string,
    posts: Post[],
    count: number}>(url)
    .subscribe(resData=>{

      this._posts = resData.posts;
      const postListStatis:PostListStatus = {
        posts: resData.posts,
        count: resData.count
      }
      this._postListStatusSubject.next(postListStatis);

      //LOADING COMPLETE.
       this._loadingSubject.next(false);
    });
 }


removePost (id: string): Observable<{message:string,count:number}> {
  const url = `${BACKEND_URL}/delete/${id}`;

  //LOADING...
  this._loadingSubject.next(true);
  return this.http.delete<{message:string, count:number}>(url);

}

getPost(id:string){
  return this.http.get<{post:Post}>(`${BACKEND_URL}/edit/${id}`);
}


get loadingSubject(){
  return this._loadingSubject.asObservable();
}


get postListStatusSubject(){
  return this._postListStatusSubject.asObservable();
}


 getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}


randomColor():string{
  const red:number = this.getRandomIntInclusive(0,255);
  const blue:number = this.getRandomIntInclusive(0,255);
  const green:number = this.getRandomIntInclusive(0,255);

  return `rgba(${red}, ${blue}, ${green}, 0.2)`;
}

}
