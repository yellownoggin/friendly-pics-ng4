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


	constructor(private database: AngularFireDatabase, private auth: AuthService) {
        this.likeStatus = false;
     }

	ngOnInit() {
		this.userUid = this.auth.getCurrentUser().uid;
		this.getLikeStatus(this.postKey, this.userUid);
	}

	updateLike(likeValue) {
		const val = false;
		// TODO: The use of object here? Is there just a ref method to use.
		// Reason: why instigating structure to the reference or query.
        const like = this.database.object(`/likes/${this.postKey}/${this.userUid}`);
		like.set(val ? firebase.database.ServerValue.TIMESTAMP : null );
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
