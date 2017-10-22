import { Component, OnInit, Input, ViewChild, Renderer2, AfterViewInit } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from '../providers/auth.service';
import * as firebase from 'firebase';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';

@Component({
	selector: 'fp-like',
	templateUrl: './like.component.html',
	styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit {
    likeClick$: any;
    click$: Observable<{
    }>;
    userUid2: any;
	@Input() postKey: any;
    likeStatus: any;
    userUid: string;
	// TODO: what is the type? Need for proper development.
	db: any;
	likesCount: any;


	@ViewChild ('likeButton') button: any;

	constructor(private database: AngularFireDatabase, private auth: AuthService, private render: Renderer2) {
        this.likeStatus = false;
		// TODO: Should this not be in the constructor arguments somehow.
		this.db = firebase.database(); // Using the traditional database api
     }



	ngOnInit() {
		this.userUid = this.auth.getCurrentUser().uid;
		this.getLikeStatus(this.postKey, this.userUid).subscribe((data) => {
			this.likeStatus = data;
		});


		this.registerForLikesCount().subscribe((a) => {
			this.likesCount = a.length;
		});

		// updateLike
		this.likeClick$ = Observable.fromEvent(this.button.nativeElement, 'click' );
	 	this.likeClick$.switchMap((data) => {
			console.log('clicked');
			return this.updateLike();
		}).subscribe((data) => {
			console.log('data from like click', data);
		});

	}





	/* TODO: This is in the firebase.js file in friendly: decide */
	/* Updates the like status from the current user */

	// from event make this an observable
	//




	updateLike() {
		return this.getLikeStatus(this.postKey, this.userUid).take(1).switchMap((likeState) => {
			console.log('likeState', likeState);
			const likeRef = this.db.ref(`/likes/${this.postKey}/${this.userUid}`);
			// const promise = !likeState ? firebase.database.ServerValue.TIMESTAMP : null;
			const promise = likeRef.set(!likeState ? firebase.database.ServerValue.TIMESTAMP : null );
			console.log('promise', promise);
			// return Observable.of([1, 2, 3]);
			return Observable.fromPromise(promise);

		});
	}

	getLikeStatus(postId, userUid) {
		return  this.database.object(`/likes/${postId}/${userUid}`).valueChanges();

	}

	registerForLikesCount() {
		return this.database.list(`/likes/${this.postKey}`).snapshotChanges().map((a) => {
			return a;
		});
	}

}
