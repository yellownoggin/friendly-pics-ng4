// TODO: why don't need import the observable operators in component
import { AuthService } from '../shared/providers/auth.service';
import { FriendlyFireService } from '../shared/friendly-fire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fp-app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  canDeletePost: boolean;
  post: any;
  postId: string;

  constructor(private friendly: FriendlyFireService, private route: ActivatedRoute, private auth: AuthService) {

    // TODO: what is the pattern for getting service methods 
    // the this quesiton
    // delete if logic 
    // if currentLogged in user is the user page id 
    this.getCurrentPostData().switchMap((data) => {
      console.log(data);
      // bind the postData to post
      this.post = data;
     return this.displayDeleteButton(this.post.author);
    }).subscribe((data) => {
        // bind the displayDeleteButton value
        console.log('can delete', data);
        
        this.canDeletePost = data;
    });

    
   }


  ngOnInit() {

    // TODO: console error like multiple calls or something need to find solution
    // took out the error and complete - wasn't working but also noisy what is the patter
      // this.getCurrentPostData().switchMap((data) => {
      //   console.log(data);
      //   // bind the postData to post
      //   this.post = data;
      //  return this.displayDeleteButton(this.post.author);
      // }).subscribe((data) => {
      //     // bind the displayDeleteButton value
      //     console.log('can delete', data);
          
      //     this.canDeletePost = data;
      // });
  

    
  }


  getCurrentPostData() {
    return this.route.params.switchMap((param) => {
      this.postId = param.postId;
      console.log('hello');
      return this.friendly.getPostData(this.postId);
    }).map((data) => {
      // return data;
      const $key = data.payload.key;
      return {$key, ...data.payload.val()};
    });
  }

  // Displays delete if userlogged in & user is author of post
  displayDeleteButton(author: any) {
   return  this.auth.getAuthState().map((auth) => {
     if (auth && author.uid === auth.uid) {
       return true;
     } else {
       return false;
     }
    });
  }

}
