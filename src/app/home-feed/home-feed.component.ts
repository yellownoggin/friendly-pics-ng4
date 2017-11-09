import { DomSanitizer } from '@angular/platform-browser';
import { FriendlyFireService } from '../shared/friendly-fire.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AuthService } from '../shared/providers/auth.service';
import { Observable } from 'rxjs/Observable';
import { StagingService } from '../staging/staging.service';


@Component({

	selector: 'fp-app-home-feed',
	templateUrl: './home-feed.component.html',
	styleUrls: ['./home-feed.component.css']
})


export class HomeFeedComponent implements OnInit {
	newPostsLength: number;
	originalLength: any;
	nextPage: any;
	friendlyPosts: any;

	constructor(
		private friendly: FriendlyFireService,
		private sanitizer: DomSanitizer,
		private auth: AuthService,
		private staging: StagingService
	) { }


	// TODO: use this for the original post new post notification logic
	// get originalPostCount() {
	//     return _originalPostsCount
	// }
	// set originalPostCount(length) {
	//      _originalPostsCount = length;
	// }

	ngOnInit() {

		// this.getHomeFeedPostsWrapper().subscribe((data) => {
		// 	// console.log('data in the home-feed component', data[1]);
		// 	this.friendlyPosts = _.reverse(data['posts']);
		// 	this.nextPage = data['next'];
		// 	// console.log('this.originalLength', this.originalLength);
		// });

        this.getHomeFeedPostsWrapper().subscribe((data) => {
			// console.log('data in the home-feed component', data[1]);
			this.friendlyPosts = _.reverse(data['posts']);
			this.nextPage = data['next'];
			// console.log('this.originalLength', this.originalLength);
		});

		this.staging.getOriginalPostCount('home').subscribe((n) => {
			console.log('saving original post count working', n);
			this.originalLength = n;
			//  console.log(this.originalLength);
		});

		this.staging.notifyForNewPosts('home').subscribe((realTimePostLength: number) => {
			if (this.originalLength < realTimePostLength) {
				this.newPostsLength = realTimePostLength - this.originalLength;
                console.log('results for post length comparison', this.newPostsLength);
			} else {
                return;
            }
		});
	}


	// Development Staging

	// End of staging


	/**
	 * Component methods
	 */



	getHomeFeedPostsWrapper(): Observable<any> {
		return this.auth.getAuthState().map((user) => {
			return user.uid;
		}).switchMap((userId) => {
			return this.friendly.getHomeFeedPosts(userId);
		});
	}

	// Used in the new post call because of the added new post length
	// TODO: need to re-factor with getHomeForThePost?Wrapper(make universal with
	//  all feeds, think get post, get home feed post how do they do it? )
	getHomeFeedPostsWrapper2(): void {
		this.getHomeFeedPostsWrapper().subscribe((data) => {
			// console.log('data in the home-feed component', data[1]);
			this.friendlyPosts = _.reverse(data['posts']);
			this.nextPage = data['next'];
            this.newPostsLength = 0;
			// console.log('this.originalLength', this.originalLength);
		});
	}

	addNextPage() {
		this.nextPage().subscribe((data) => {
			// concatenate reversed friendlyPosts from next stage method
			// console.log('data["posts"]', data['posts']);

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
