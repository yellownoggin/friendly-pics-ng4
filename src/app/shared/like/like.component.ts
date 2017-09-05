import { Component, OnInit, Input } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../providers/auth.service';
import * as firebase from 'firebase';

@Component({
	selector: 'fp-like',
	templateUrl: './like.component.html',
	styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit {
	@Input() postKey: any;
    likeStatus: boolean;
    userUid: string;
	// TODO: what is the type? Need for proper development.
	db: any;


	constructor(private database: AngularFireDatabase, private auth: AuthService) {
        this.likeStatus = false;
		// TODO: Should this not be in the constructor arguments somehow.
		this.db = firebase.database(); // Using the traditional database api
     }

	ngOnInit() {
		this.userUid = this.auth.getCurrentUser().uid;
		this.getLikeStatus(this.postKey, this.userUid);
	}


	/* TODO: This is in the firebase.js file in friendly: decide */
	/* Updates the like status from the current user */
	updateLike(likeState) {
		const val = likeState;
		// TODO: Why .object here? Is there just a ref method to use.
		// Reason: why instigating structure to the reference or query.
        const like = this.db.ref(`/likes/${this.postKey}/${this.userUid}`);

		like.set(val ? firebase.database.ServerValue.TIMESTAMP : null )
			.then((res) => {
				console.log('updateLike action successful', res);
			})
			.catch((e) => {
				console.log('Error in the updateLike', e);
			});
	}

	getLikeStatus(postId, userUid) {
        console.log('postId', postId);
		const likeObject = this.database.object(`/likes/${postId}/${userUid}`);

		likeObject.subscribe((data) => {
			if (data.$value) {
			   this.likeStatus = true;
           } else {
               this.likeStatus = false;
           }
		});

	}

}
