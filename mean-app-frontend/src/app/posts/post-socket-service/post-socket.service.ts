import { Injectable } from '@angular/core';
import { Post } from '../post-list/post-model/post.model';
import openSocket from 'socket.io-client';
import { PostListStatus } from '../post-services/post.service';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const SOCKET_URL:string = environment.socketUrl;

export enum SocketResolverActionType {
    Create = "CREATE",
    Update = "UPDATE",
    Delete = "DELETE",
}

export interface SocketResolverAction {
  type:SocketResolverActionType;
  data:PostListStatus;
}


@Injectable({
  providedIn: 'root'
})
export class PostSocketService {
  private socket = openSocket(SOCKET_URL)
  private _postStatusSubject:Subject<PostListStatus> = new Subject<PostListStatus>()

  constructor() { }


onNewPostAction():Observable<SocketResolverAction> {
   return Observable.create(observer => {
     let data:PostListStatus;
     let type:SocketResolverActionType;

     this.socket.on('posts', data => {
       if(data.action === 'create'){
         type = SocketResolverActionType.Create
         data = {count: data.count, posts:[data.post]};
         const sockResAction: SocketResolverAction = {type: type, data: data}
         observer.next(sockResAction);
       }
       if(data.action === 'update'){
         type = SocketResolverActionType.Update
         data = {count: data.count, posts:[data.post]};
         const sockResAction: SocketResolverAction = {type: type, data: data}
         observer.next(sockResAction);
       }

       if(data.action === 'delete'){
         type = SocketResolverActionType.Delete
         data = {count: data.count, posts:[data.post]};
         const sockResAction: SocketResolverAction = {type: type, data: data}
         observer.next(sockResAction);
       }
     });
   });
}
// resolveSocket(){
//     .on('posts', data =>{
//       if(data.action === 'create'){
//         const listStatus:PostListStatus = {count: data.count, posts:[data.post]};
//         this._postStatusSubject.next(listStatus);
//         console.log('emmited')
//       }
//       else{
//       }
//   });
// }




}
