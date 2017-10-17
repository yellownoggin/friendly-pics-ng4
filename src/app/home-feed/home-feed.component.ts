import { DomSanitizer } from '@angular/platform-browser';
import { FriendlyFireService } from '../shared/friendly-fire.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AuthService } from "../shared/providers/auth.service";
import { Observable } from "rxjs/Observable";
@Component({

  selector: 'fp-app-home-feed',
  templateUrl: './home-feed.component.html',
  styleUrls: ['./home-feed.component.css']
})
export class HomeFeedComponent implements OnInit {

  nextPage: any;
  friendlyPosts: any;
  /**
   * part 1
   * 1. get the posts
   * 2. bind them
   * part 2
   * 4. check
   * 3. subscribe to home feed (meaning when there is chages)
   */


  constructor(private friendly: FriendlyFireService, private sanitizer: DomSanitizer, private auth: AuthService) {}

  ngOnInit() {
    this.getHomeFeePostsWrapper().subscribe((data) => {
        console.log('data in the home-feed component', data[1]);
            this.friendlyPosts = _.reverse(data['posts']);
            this.nextPage = data['next'];
     });
  }

 // TODO: the user pattern can this be in the service(in this case)
 // FriendlyFireService 
  getHomeFeePostsWrapper(): Observable<any> {
     return this.auth.getAuthState().map((user) => {
          return user.uid;
      }).switchMap((userId) => {
          return this.friendly.getHomeFeedPosts(userId);
      });

  }

  addNextPage() {
		this.nextPage().subscribe((data) => {
			// concatenate reversed friendlyPosts from next stage method
			console.log('data["posts"]', data['posts']);

			let nextPagePosts = data['posts'];
			// making so descending order
			nextPagePosts = _.reverse(nextPagePosts);
			this.friendlyPosts = _.concat(this.friendlyPosts, nextPagePosts);
			this.nextPage = data['next'];
		});
	}

	getBackgroundImage(image) {
		return this.sanitizer.bypassSecurityTrustStyle(`url(${image}) no-repeat`);
	}

}
