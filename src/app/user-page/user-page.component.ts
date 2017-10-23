import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../shared/providers/auth.service';
import { FriendlyFireService } from '../shared/friendly-fire.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as firebase from 'firebase/app';
import { StagingService } from "../staging/staging.service";
import { ActivatedRoute, Router } from '@angular/router';


@Component({
	selector: 'fp-app-user-page',
	templateUrl: './user-page.component.html',
	styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, AfterViewInit {
	newPostsLength: number;
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
		// TODO:see re-factor re-factoring

		this.route.params.switchMap((param) => {
			const profileId = param.id;
            console.log('profileId', profileId);
			return this.friendly.getUserFeedPosts(profileId);
		}).subscribe(
			(data) => {
				console.log('posts', data['posts']);
				console.log('next', data['next']);
				this.userPosts = _.reverse(data['posts']);
				this.nextPage = data['next'];
				this.newPostsLength = 0;
			},
			(error) => { console.log('getUserFeedPosts error', error); },
			() => { console.log('getUserFeedPosts is completed'); }
			);




	}

	ngAfterViewInit() { }







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
