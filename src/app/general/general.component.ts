import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { FriendlyFireService } from '../shared/friendly-fire.service';
import { FeedService } from '../shared/feed.service';
import * as _ from 'lodash';
import { StagingService } from "../staging/staging.service";


@Component({
	templateUrl: './general.component.html',
	// TODO: need a shared css
	styleUrls: ['./general.component.css', '../shared/css/shared-feed.css'],
	providers: [FriendlyFireService, FeedService]
})


export class GeneralComponent implements OnInit {
	newPostsLength: number;
	originalCount: any;
	e: any;
	// TODO: function type?
	nextPage: any;
	friendlyPosts: any[];

	constructor(private friendly: FriendlyFireService, private feed: FeedService,
		private sanitizer: DomSanitizer, private staging: StagingService) {
	}




	ngOnInit() {
		// this.friendly._getPaginatedFeed('/posts', this.friendly.POST_PAGE_SIZE);
		// TODO: multiple calls in the _getPaginatedFeed needs fixing
		// 	- also it doesn't complete

		// Get posts for component
		this.friendly.getPosts().subscribe((data) => {
			console.log('data in the general component', data['posts']);
			this.friendlyPosts = _.reverse(data['posts']);
			this.nextPage = data['next'];
		});

		// Using the home posts version of 2


		this.staging.getOriginalPostCount('general').subscribe((count) => {
			console.log('original count in general: ', count);
			this.originalCount = count;
		});

		this.staging.notifyForNewPosts('general').subscribe((realTimePostLength) => {
			if (this.originalCount < realTimePostLength) {
				this.newPostsLength = realTimePostLength - this.originalCount;
				console.log('this.newPostsLength', this.newPostsLength);
			} else {
				return;
			}
		});

	}

	// Component Logic

	// Used in the new post call because of the added new post length
	// TODO: need to re-factor with getHomeForThePost?Wrapper(make universal with
	//  all feeds, think get post, get home feed post how do they do it? )
	getHomeFeedPostsWrapper2(): void {
		this.friendly.getPosts().subscribe((data) => {
			// console.log('data in the home-feed component', data[1]);
			this.friendlyPosts = _.reverse(data['posts']);
			this.nextPage = data['next'];
			this.newPostsLength = 0;
			// console.log('this.originalLength', this.originalLength);
		});
	}



	// Refactor to service with other components
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
