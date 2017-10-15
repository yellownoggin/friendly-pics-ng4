import { Injectable, OnInit, AfterViewInit } from '@angular/core';

import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
// TODO: this is when the primary be using angularfire 4
import * as firebase from 'firebase/app';
import { AuthService } from './providers/auth.service';
import { FirebaseApp } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';


@Injectable()
export class FriendlyFireService {
	user: Observable<firebase.User>;
	db: firebase.database.Database;
	tsf: any;
	storage: any;
	items: AngularFireList<any[]>;
	pageSize: number;
	currentUser: any;
	postObservables: Observable<any>[] = [];

	get POST_PAGE_SIZE(): number {
		return 4;
	}

	constructor(private database: AngularFireDatabase,
		private auth: AuthService, private app: FirebaseApp, private afAuth: AngularFireAuth) {
		// this.pageSize = 5;
		this.storage = this.app.storage();
		this.db = this.app.database();
		// this.currentUser = this.afAuth.authState();
		this.user = this.afAuth.authState;
		this.user.subscribe(
			(value) => {
				console.log('value', value.uid);
				this.currentUser = value;
			},
			(error) => { console.log('error', error); },
			() => { console.log('complete it is '); }
		);

		// console.log('this.currentUser in friendly', this.currentUser.uid);
		// testing

	}

	/**
	Staging
	*/

    /**
     * Used for all ofther feed bc reletive postId's located different location
     * Used for User & Home Feeds
     */
	_getPaginatedFeedWithPostDetails(uri, pageSize, earliestEntryId?, fetchPostDetails = true): Observable<any> {
		// TODO: needs to be outside of query for last map to see (anitpattern)
		let nextPage = null;
		// Pagination check for more posts beyond page
		const pageSizeOne = pageSize + 1;
		const queryOptions = {
			query: {
				orderByKey: true,
				limitToLast: pageSizeOne
			}
		};
		// Used pages beyond the first
		if (earliestEntryId) {
			queryOptions['query']['endAt'] = earliestEntryId;
		}

		const query$ = this.database.list(`${uri}`, queryOptions);

		// Switchmap to new Observable.zip call
		return query$.switchMap((posts) => {
			console.log('posts from _getPaginatedFeedWithPostDetails', posts);
			// Figure out and set up nextPage

			if (posts.length > pageSize) {
				const nextStartingId = posts.shift().$key;
				// Store for pagination function
				nextPage = () => {
					this._getPaginatedFeedWithPostDetails(uri, pageSize, nextStartingId, fetchPostDetails);
				};
			}

			// fetchPostDetails
			const postDetailObservablesArray = posts.map((post) => {
				return this.getPostData(post.$key);
			});

			return Observable.zip(...postDetailObservablesArray);

		}).map((v: any) => {
			console.log('v', v[0].$key);
			return {
				posts: v,
				next: nextPage
			};
		});
	}



	// TODO: can I make this private is a good example
	// Used for general feed (does not need to fetchPostDetails logic)
	_getPaginatedFeed(uri, pageSize, earliestEntryId?, fetchPostDetails = false): Observable<any> {
		// TODO: needs to be outside of query for last map to see (anitpattern)
		let nextPage = null;
		// Pagination check for more posts beyond page
		const pageSizeOne = pageSize + 1;
		const queryOptions = {
			query: {
				orderByKey: true,
				limitToLast: pageSizeOne
			}
		};
		// Used pages beyond the first
		if (earliestEntryId) {
			queryOptions['query']['endAt'] = earliestEntryId;
		}

		const query$ = this.database.list(`${uri}`, queryOptions);

		// Using map to return as as
		return query$.map((posts) => {
			console.log('map callled');
			console.log('posts', posts);

			// Figure out if there is nextPage
			if (posts.length > pageSize) {
				// delete post used to identify if nextpage
				posts.splice(0, 1);
				const nextStartingId = posts[0].$key;
				nextPage = () => {
					return this._getPaginatedFeed(uri, pageSize, nextStartingId);
				};
			}
			return [posts, nextPage];
		});

}

// End Of Staging

















getPostData(postId) {
	return this.database.object(`/posts/${postId}`);
}



getUserFeedPosts(uid) {
	console.log('getUserFeedPosts called');
	return this._getPaginatedFeedWithPostDetails(`/people/${uid}/posts`, this.POST_PAGE_SIZE, null, true);
}


deletePost(postId, pictureStorageUri, thumbStorageUri) {
	console.log(`Deleting ${postId}`);

	// CONSTRUCT/DEFINE update object for real-time database data deletion
	const updateObject = {};
	updateObject[`/posts/${postId}`] = null;
	updateObject[`/people/${this.currentUser.uid}/posts/${postId}`] = null;
	updateObject[`/feed/${this.currentUser.uid}/${postId}`] = null;
	updateObject[`/comments/${postId}`] = null;
	updateObject[`/likes/${postId}`] = null;

	// DEFINE/CALL deleteFromDatabase promise
	const deleteFromDatabase = this.db.ref().update(updateObject);

	// IF Picture Uris DEFINE/CALL storage delete promises
	if (pictureStorageUri) {
		const deleteFullFromStorage = this.storage.refFromURL(pictureStorageUri).delete();
		const deleteThumbFromStorage = this.storage.refFromURL.delete();
		return Promise.all([deleteFromDatabase, deleteFullFromStorage, deleteThumbFromStorage]);
	}

	// RETURNS this promise if no picture uris
	return deleteFromDatabase;
}



uploadNewPicture(fullBlob, thumbBlob, fileName, text) {
	// 1. create storage refs for the each of the files/blobs
	// 2. put then log ou the snapshot.metadata.downloadURLs[0]


	// Set up full reference & storage upload task
	console.log('this.currenUser uid in the unp', this.currentUser.uid);
	const fullRef = this.storage.ref(`${this.currentUser.uid}/full/${Date.now()}/${fileName}`);

	// TODO: take this out
	this.tsf = fullRef;

	const metadata = {
		contentType: fullBlob.type
	};

	const fullRefTask = fullRef.put(fullBlob, metadata).then(snapshot => {
		const url = snapshot.metadata.downloadURLs[0];
		return url;
	})
		.catch(e => {
			console.error('Error while uploading new pic', e);
		});


	// Set up thumb reference & storage upload task
	const thumbRef = this.storage.ref(`${this.currentUser.uid}/thumb/${Date.now()}/${fileName}`);
	const thumbRefTask = thumbRef.put(thumbBlob, metadata).then(snapshot => {
		const url = snapshot.metadata.downloadURLs[0];
		return url;
	})
		.catch(e => {
			console.error('Error while uploading new pic', e);
		});

	return Promise.all([fullRefTask, thumbRefTask])
		.then((urls) => {
			const newPostKey = this.db.ref('/posts').push().key;

			const update = {};
			update[`/posts/${newPostKey}`] = {
				full_url: urls[0],
				thumb_url: urls[1],
				test: text,
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				full_storage_uri: fullRef.toString(),
				thumb_storage_uri: thumbRef.toString(),
				author: {
					uid: this.currentUser.uid,
					full_name: this.currentUser.displayName,
					profile_pricture: this.currentUser.photoURL
				},
			};

			this.tsf = {
				storage: fullRef,
				thumb: thumbRef,
				databasePostRef: this.db.ref(`/posts/${newPostKey}`)

			};
			// update current user profile feed

			update[`/people/${this.currentUser.uid}/posts/${newPostKey}`] = true;
			// update current user personal feed
			update[`/feed/${this.currentUser.uid}/${newPostKey}`] = true;

			return this.db.ref().update(update)
				.then(() => {
					return newPostKey;

				});
		});

}

deleteTsf() {
	this.tsf.storage.delete().then((a) => {
		console.log('a', a);

	});
	this.tsf.thumb.delete().then((a) => {
		console.log('a', a);

	});

	console.log('this.tsf.databasePostRef', this.tsf.databasePostRef);

}

getComments(postKey) {
	const query = this.database.list(`/comments/${postKey}`, {
		query: {
			orderByKey: true,
			limitToLast: 3
		}
	});

	return query;
}

/**
 * Gets posts(amount depending on POST_PAGE_SIZE) &
 * supplies next page function using earliestEntryId/latestEntryId
 * @return {Observable} post from real-time database & next page function
 */
getPosts() {
	// TODO: this.POST_PAGE_SIZE?versus friendly.POST_PAGE_SIZE
	return this._getPaginatedFeed('/posts', this.POST_PAGE_SIZE);
}




/**
 * Shared methods
 */

addComment(commentText, postId) {
	const postComments = this.database.list(`/comments/${postId}`);
	// Need current user information for comment object
	const currentUser = this.auth.getCurrentUser();

	// Create comment object...
	const commentObject = {
		text: commentText,
		timestamp: Date.now(),
		author: {
			uid: currentUser.uid,
			full_name: currentUser.displayName,
			profile_picture: currentUser.photoURL
		}
	};

	postComments.push(commentObject)
		.then((res) => {
			console.log('New comment pushed. Comment keyId: ', res.key);
		});
}


}
