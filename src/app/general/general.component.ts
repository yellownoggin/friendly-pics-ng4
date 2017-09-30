import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { FriendlyFireService } from '../shared/friendly-fire.service';
import { FeedService } from '../shared/feed.service';
import * as _ from 'lodash';





@Component({
	templateUrl: './general.component.html',
	// TODO: need a shared css
	styleUrls: ['./general.component.css', '../shared/css/shared-feed.css'],
	providers: [FriendlyFireService, FeedService]
})

export class GeneralComponent implements OnInit {
e: any;
	// TODO: function type?
	nextPage: any;
	friendlyPosts: any[];

	constructor(private friendly: FriendlyFireService, private feed: FeedService, private sanitizer: DomSanitizer ) {
	
	}




	ngOnInit() {
		// this.friendly._getPaginatedFeed('/posts', this.friendly.POST_PAGE_SIZE);
		this.friendly.getPosts().subscribe((data) => {
			this.friendlyPosts = _.reverse(data[0]);
			this.nextPage = data[1];
		});

	}

	addNextPage() {
		this.nextPage().subscribe((data) => {
			// concatenate reversed friendlyPosts from next stage method
			let nextPagePosts = data[0];
			// making so descending order
			nextPagePosts = _.reverse(nextPagePosts);
			this.friendlyPosts = _.concat(this.friendlyPosts, nextPagePosts);
			this.nextPage = data[1];
		});
	}

	getBackgroundImage(image) {
		return this.sanitizer.bypassSecurityTrustStyle(`url(${image}) no-repeat`);
	}

}



