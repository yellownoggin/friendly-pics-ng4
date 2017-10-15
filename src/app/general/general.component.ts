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
		// TODO: multiple calls in the _getPaginatedFeed needs fixing 
		// 	- also it doesn't complete 
		this.friendly.getPosts().subscribe((data) => {
			console.log('data in the general component', data['posts']);
			// console.log('data in the general component', data[1]);
			
			this.friendlyPosts = _.reverse(data['posts']);
			this.nextPage = data['next'];
		},
		(error) => {
			console.log('get posts error general component', error);
		},
		() => {
			console.log('getPosts complete');
				
		}
	);

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



