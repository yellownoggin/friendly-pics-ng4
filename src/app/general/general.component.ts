import { Component, OnInit } from '@angular/core';

import { FriendlyFireService } from '../shared/friendly-fire.service';
import { FeedService } from '../shared/feed.service';
import * as _ from 'lodash';

@Component({
	templateUrl: './general.component.html',
	providers: [FriendlyFireService, FeedService]
})

export class GeneralComponent implements OnInit {
	e: any;
	// TODO: function type?
	nextPage: any;
	friendlyPosts: any[];
	

	constructor(private friendly: FriendlyFireService, private feed: FeedService) {

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
			this.friendlyPosts = _.concat(nextPagePosts, this.friendlyPosts);
			this.nextPage = data[1];
		});
	}

}
