import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../shared/providers/auth.service';
import { FriendlyFireService } from '../shared/friendly-fire.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as firebase from 'firebase/app';
import { StagingService } from "../staging/staging.service";
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/take';

@Component({
	selector: 'fp-app-user-page',
	templateUrl: './user-page.component.html',
	styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, AfterViewInit {
    newPostsLength: number;
	userFeed$: Observable<any>;
	// resets the length when get feed is called(navigation/next page) to compare to real-time
	addPostsLengthReset: number;
	originalLength: any;
	nextPage: any;
	userPosts: any;
	currentUser: firebase.User;
	user: Observable<firebase.User>;
	componentName: string;

	constructor(private afAuth: AngularFireAuth, private friendly: FriendlyFireService,
		private staging: StagingService, private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.componentName = 'user page component';
		// Main feed
		this.userFeed$ = this.getUserFeedPostsComponent();
		this.userFeed$.subscribe((feed) => {
			// console.log('feed', feed);
			this.userPosts = feed.posts;
			this.addNextPage = feed.next;
			this.newPostsLength = feed.newPostsLengthReset;
		});
		// Real-time new posts
		// Get & store original length to compare  & get new post number
		this.getFeedPostCountOnceUserComponent().subscribe((count) => {
			this.originalLength = count;
		});
		this.notifyForNewPostsUserComponent().subscribe((realTimePostLength) => {
			// this should be in a function so those are the repeat: getNewPostLength(use only in the description)
			console.log('realTimePostLength', realTimePostLength);
			console.log('this.originalLength', this.originalLength);
			if (this.originalLength < realTimePostLength) {
				console.log();
				this.newPostsLength = realTimePostLength - this.originalLength;
                console.log('results for post length comparison', this.newPostsLength);
			} else {
                return;
            }
		});

	}

	ngAfterViewInit() { }

	// staging

	notifyForNewPostsUserComponent() {
		return this.route.params.switchMap((param) => {
			const profileId = param;
			return this.staging.notifyForNewPosts('user', profileId);
		});
	}

	getFeedPostCountOnceUserComponent() {
		return this.route.params.switchMap((param) => {
			const profileId = param.id;
			return this.staging.getFeedPostCountOnce('user', profileId);
		});
	}

	// && of staging

	getUserFeedPostsComponent() {
		return this.route.params.switchMap((param) => {
			const profileId = param.id;
			// console.log('profileId', profileId);
			return this.friendly.getUserFeedPosts(profileId);
		}).map(
			(data) => {
				// console.log('posts', data['posts']);
				// console.log('next', data['next']);

				data['posts'] = _.reverse(data['posts']);
				data['newPostsLengthReset'] = 0;
				return data;
			});
	}

	// Used in template for addNewPosts feature sets bindings
	getUserFeedPostsComponentWithBindings() {
		this.route.params.switchMap((param) => {
			const profileId = param.id;
			// console.log('profileId', profileId);
			return this.friendly.getUserFeedPosts(profileId);
		}).map((data) => {
			// console.log('posts', data['posts']);
			// console.log('next', data['next']);

			data['posts'] = _.reverse(data['posts']);
			data['newPostsLengthReset'] = 0;
			return data;
		}).subscribe((feed) => {
			this.userPosts = feed.posts;
			this.addNextPage = feed.next;
			this.newPostsLength = feed.newPostsLengthReset;

		});


	}




	// TODO: Refactor all components using to a service
	addNextPage() {
		this.nextPage().subscribe((data) => {
			// concatenate reversed friendlyPosts from next stage method
			console.log('data["posts"]', data['posts']);

			let nextPagePosts = data['posts'];
			// making so descending order
			nextPagePosts = _.reverse(nextPagePosts);
			this.userPosts = _.concat(this.userPosts, nextPagePosts);
			this.nextPage = data['next'];
		});
	}


}
