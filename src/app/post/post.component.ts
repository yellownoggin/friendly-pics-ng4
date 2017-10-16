// TODO: why don't need import the observable operators in component
import { FriendlyFireService } from '../shared/friendly-fire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fp-app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  post: Object;
  postId: string;
/**
 * requirements: 
 * 0. need a post route with dynamic route  (x)
 * 1. url post/postId - this is set up in the (x)
 * 2. getPost for the post page
 * 3. -- need to get the post Id to use in component 
 * 
 */
 
 

  constructor(private friendly: FriendlyFireService, private route: ActivatedRoute) {

    // TODO: what is the pattern for getting service methods 
    
   }


  ngOnInit() {
      this.getCurrentPostData().subscribe((data) => {
        console.log(data);
       this.post = data;
    },
    (e) => {
      console.log('error in currentpostdata', e);
    },
    () => {
      console.log('complete');
    });
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

}
