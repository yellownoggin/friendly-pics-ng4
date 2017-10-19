import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../shared/providers/auth.service';
import { FriendlyFireService } from '../shared/friendly-fire.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as firebase from 'firebase/app';
import { StagingService } from "../staging/staging.service";


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
        private staging: StagingService) {
    }

    ngOnInit() {
        this.componentName = 'user page component';
        // TODO:
        this.user = this.afAuth.authState;
        this.getUsersFeedPosts();

        this.staging.getFeedPostCountOnce('user').subscribe((count) => {
            console.log('saving original post count working', count);
            this.originalLength = count;
        });

        this.staging.notifyForNewPosts('user').subscribe((newPostsLength) => {
            if (this.originalLength < newPostsLength) {
                this.newPostsLength = newPostsLength - this.originalLength;
            } else {
                return;
            }
        });
    }

    ngAfterViewInit() { }

    // TODO: jsdocs  (change this to load posts like friendly-pix? and)
    // And change to loadUserFeedPage
    getUsersFeedPosts() {
        this.user.subscribe(
            (value) => {
                console.log('value', value.uid);
                this.currentUser = value;
                this.friendly.getUserFeedPosts(this.currentUser.uid).subscribe(
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


    // this is the friendlyfire defined method called in component
    // does more than just get posts for use feed
    // can put this in the getUserFeedPosts maybe
    loadUserFeedPage() {
        /**
        the ui or component logic

        1. IF check the length and show or no show  value for element
        2. firebae.subscribetouserfeed - userId, callback*, ?
            * b. call back
            *   prepends, creates imagecard
            *   hides no post element
            * c. ?
        3. this.addPosts(data.entries) ---- Angular this is done in the template
        4. this.toggleNextPageButton setUp infinitescroll or next page (half done in template*)

         */
    }

}
