import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder,Validators, NgForm } from '@angular/forms';
import { PostService } from '../post-services/post.service';
import { Post } from '../post-list/post-model/post.model';
import { Subscription } from 'rxjs';
import { mimeType } from './mime-type.validator';
import { Router, ActivatedRoute } from '@angular/router';
import { MyErrorStateMatcher } from 'src/app/login/login-service/login.error-state-matcher';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {


   createPostForm = this.fb.group({
    title: ['Me, Myself and I...', [Validators.required, Validators.minLength(6)]],
    content: [null, [Validators.required, Validators.minLength(6)]],
    image: [null,[Validators.required], [mimeType]]
  });
   matcher = new MyErrorStateMatcher();
   editing : boolean = false;
   editSub : Subscription = new Subscription();
   editPostSub : Subscription = new Subscription();
   editingId : string;
   src:string;
   imageButtonClicked:boolean = false;

  @ViewChild('myForm', {static: false}) myForm: NgForm;

  constructor(
     private fb:FormBuilder,
     private postService:PostService,
     private router:Router,
     private route:ActivatedRoute) {
    }

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      const id = this.editingId = params.get('id');
      if(id!==null){
        this.editing = true;
        this.postService.getPost(id).subscribe(res=>{
          console.log(res);
          const title:string = res.post.title;
          const content:string = res.post.content;
          const imagePath: string | File = res.post.imagePath;

          this.createPostForm.patchValue({
            title: title,
            content: content,
            image: imagePath
          });

          this.src = imagePath;
        });
      }
    })
  }


  addPost(){
    console.log(this.imageButtonClicked)
    if (this.createPostForm.valid) {
      const title:string = this.createPostForm.get('title').value;
      const content:string = this.createPostForm.get('content').value;
      const image:File = this.createPostForm.get('image').value;

      this.postService.addPost(title, content, image).subscribe(res=>{
        this.router.navigate(['/posts'])
      });

      this.myForm.resetForm();
      this.createPostForm.reset();
      this.imageButtonClicked = false;
    }

  }

  editPost(){
    if (this.createPostForm.valid) {
      const title:string = this.createPostForm.get('title').value;
      const content:string = this.createPostForm.get('content').value;
      const image:string = this.createPostForm.get('image').value;

      const post: Post = {id:this.editingId, title:title,content:content, imagePath:image, creator:null};
      console.log(`EDITING:${this.editing}`);
      this.postService.editPost(post).subscribe(res=>{
        this.router.navigate(['/posts'])
      })


      this.editing = false;
      this.editingId = undefined;

      this.myForm.resetForm();
      this.createPostForm.reset();
      this.imageButtonClicked = false;

    }
  }

  imageSelected(event:Event){
    const file = (event.target as HTMLInputElement).files[0];
    if(file!==undefined){
      this.createPostForm.patchValue({image:file});
      this.createPostForm.get('image').updateValueAndValidity();

      const reader = new FileReader();

      reader.onload = () =>{
        this.src = (reader.result as string);
      }
      reader.readAsDataURL(file);
    }


  }

  ngOnDestroy(): void {
    this.editSub.unsubscribe();
    this.editPostSub.unsubscribe();
  }


}
