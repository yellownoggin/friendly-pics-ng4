import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../shared/providers/auth.service';
import { FriendlyFireService } from '../shared/friendly-fire.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';


@Component({
    selector: 'fp-app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, AfterViewInit {
    getNextPosts: any;
    userPosts: any;
    currentUser: firebase.User;
    user: Observable<firebase.User>;
    componentName: string;

    constructor(private afAuth: AngularFireAuth, private friendly: FriendlyFireService) {
    }

    ngOnInit() {
        this.componentName = 'user page component';
        // TODO:
        this.user = this.afAuth.authState;
        this.getUsersFeedPosts();
    }

    ngAfterViewInit() {}

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
                            this.getNextPosts = data['next'];
            },
            (error) => { console.log('getUserFeedPosts error', error); },
            () => { console.log('getUserFeedPosts is completed'); }
        );
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
