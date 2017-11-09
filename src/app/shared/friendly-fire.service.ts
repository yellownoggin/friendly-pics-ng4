import { Injectable, OnInit, AfterViewInit } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
// TODO: this is when the primary be using angularfire 4
import * as firebase from 'firebase/app';
import * as _ from "lodash";
import { AuthService } from './providers/auth.service';
import { FirebaseApp } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';


@Injectable()
export class FriendlyFireService {
	currentUserA: firebase.User;
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
		this.auth.getAuthorizationState().subscribe(
			(value) => {
				console.log('value', value.uid);
				this.currentUser = value;
			});
	}

    /**
     * Contents (Methods by section feature/logic)
     *
     * (last#). DELETE USER
     */

	/**
	Staging
	*/



	/**
	 * End of Staging
	 */


	/**
	 * Retrieving Methods
	 */


	getHomeFeedPosts(userId) {

		// TODO: currentUser undefined ?? but in other methods in this using it is not
		// console.log('this.currentUser.uid', this.currentUser);
		// return this._getPaginatedFeedWithPostDetails(`/feed/${this.currentUser.uid}`, this.POST_PAGE_SIZE, null, true);


		console.log('this in get home feed posts', this.currentUserA);
		return this._getPaginatedFeedWithPostDetails(`/feed/${this.currentUser.uid}`, this.POST_PAGE_SIZE, null, true);

	}

	getPostData(postId) {
		return this.database.object(`/posts/${postId}`)
			.snapshotChanges();
	}



	getUserFeedPosts(pageUid) {
		console.log('getUserFeedPosts called');
		return this._getPaginatedFeedWithPostDetails(`/people/${pageUid}/posts`, this.POST_PAGE_SIZE, null, true);
	}


    /**
     * Used for all ofther feed bc reletive postId's located different location
     * Used for User & Home Feeds
     */
	_getPaginatedFeedWithPostDetails(uri, pageSize, earliestEntryId?, fetchPostDetails = true): Observable<any> {
		// TODO: needs to be outside of query for last map to see (anitpattern)
		let nextPage = null;
		// Pagination check for more posts beyond page
		const pageSizeOne = pageSize + 1;
		const query = this.database.list(`${uri}`, (ref) => {
			// Used pages beyond the first
			if (earliestEntryId) {
				return ref.orderByKey().limitToLast(pageSizeOne).endAt(earliestEntryId);
			}
			return ref.orderByKey().limitToLast(pageSizeOne);
		});

		// Switchmap to new Observable.zip call
		return query.snapshotChanges().switchMap((action) => {
			const postsSnapshot = action;

			// Figure out and set up nextPage
			if (postsSnapshot.length > pageSize) {
				// First data element represents nextPageId to start with
				const nextStartingId = postsSnapshot.shift().payload.key;
				// Store for pagination function
				nextPage = () => {
					return this._getPaginatedFeedWithPostDetails(uri, pageSize, nextStartingId, fetchPostDetails);
				};
			}

			// fetchPostDetails
			const postDetailObservablesArray = postsSnapshot.map((post) => {
				return this.getPostData(post.payload.key);
			});

			return Observable.zip(...postDetailObservablesArray);

		}).map((posts: any) => {
			// console.log('posts', v[0].$key);
			// TODO:(inu) DELETEOPERATIONS (see original)
			// If turns out not postDetails delete post from users feed (think this is more for people who following posts)
			const userPosts = posts.map(element => {
				const $key = element.payload.key;
				const data = { $key, ...element.payload.val() };
				return data;
			});

			return {
				posts: userPosts,
				next: nextPage
			};

		}).take(1);
	}


	// TODO: can I make this private is a good example
	// Used for general feed (does not need to fetchPostDetails logic)
	_getPaginatedFeed(uri, pageSize, earliestEntryId?, fetchPostDetails = false): Observable<any> {

		// TODO: needs to be outside of query for last map to see (anitpattern)
		let nextPage = null;
		// Pagination check for more posts beyond page
		const pageSizeOne = pageSize + 1;
		console.log(pageSizeOne);

		const query = this.database.list(`${uri}`, (ref) => {
			// Used pages beyond the first
			if (earliestEntryId) {
				console.log('earlies entry id');

				return ref.orderByKey().limitToLast(pageSizeOne).endAt(earliestEntryId);
			}

			return ref.orderByKey().limitToLast(pageSizeOne);
		});


		// Using map to return as as
		return query.snapshotChanges().map((posts) => {
			// TODO: multiple calls in the _getPaginatedFeed needs fixing (general feed)

			// Figure out if there is nextPage
			if (posts.length > pageSize) {
				// delete post used to identify if nextpage
				const nextStartingId = posts.shift().payload.key;
				nextPage = () => {
					return this._getPaginatedFeed(uri, pageSize, nextStartingId);
				};
			}

			const feedPosts = posts.map(element => {
				const $key = element.payload.key;
				const data = { $key, ...element.payload.val() };
				return data;
			});

			return {
				posts: feedPosts,
				next: nextPage
			};
		})
			// TODO: not sure why need take here
			.take(1);


	}

	/** End Retrieving Methods  */


	// ISSUE: not returning confirmation after update (think the promise all is the issue)
	deletePost(postId, pictureStorageUri, thumbStorageUri): Promise<any> {
		console.log(`Deleting ${postId}`);

		// CONSTRUCT/DEFINE update object for real-time database data deletion
		const updateObject = {};
		updateObject[`/posts/${postId}`] = null;
		updateObject[`/people/${this.currentUser.uid}/posts/${postId}`] = null;
		updateObject[`/feed/${this.currentUser.uid}/${postId}`] = null;
		updateObject[`/comments/${postId}`] = null;
		updateObject[`/likes/${postId}`] = null;

		// DEFINE/CALL deleteFromDatabase promise
		console.log('first delete from database 1st');
		console.log(updateObject, 'updateObject');
		const deleteFromDatabase = this.db.ref().update(updateObject);

		// IF Picture Uris DEFINE/CALL storage delete promises
		if (pictureStorageUri) {
			const deleteFullFromStorage = this.storage.refFromURL(pictureStorageUri).delete();
			const deleteThumbFromStorage = this.storage.refFromURL.delete();
			console.log('promise being called');
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
					text: text,
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


	// TODO: remove when done
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
		const query = this.database.list(`/comments/${postKey}`, (ref) => {
			return ref.orderByKey().limitToLast(3);
		});

		return query.valueChanges();
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

    /**
     * DELETE USER Methods
     * TODO: Re-factor to 1 method
     */

	/** deleteUserinPeople ds: people/uid **/
	deleteUserPeople(deletedUid): Promise<void> {
		return this.database.object(`/people/${deletedUid}`).remove();
	}



    /**
     * Delete user posts
     * @return {Promise<void>}
     */

	deleteUserPostsAll(deletedUid): Observable<any> {
		const postsRef$ = this.database.list('/posts/').snapshotChanges();
		return postsRef$.switchMap((r) => {
			//  Array of posts snapshots
			const postsSnapshotsArray = r;

			const updateObject = {};

			postsSnapshotsArray.forEach((postSnapshot) => {
				// Save key for later if post is by user
				const postKey = postSnapshot.key;
				const postDataObject = postSnapshot.payload.val();

				// data structure
				// posts/author/uid

				if (postDataObject.author.uid === deletedUid) {
					console.log(postDataObject.author.uid);
					updateObject[`posts/${postKey}`] = null;
				}

			});
			return Observable.fromPromise(this.database.object('/').update(updateObject));
		});
	}

    /**
       deleteUserFeed
        1. Parent key is userId, so
        2. Everything in reference is deleted
        3. Use remove() versus iterating & multi-reference delete pattern(null)
     */
	deleteUserFeed(userIdToDelete): Promise<void> {
		const feedReference = this.database.list(`/feed/${userIdToDelete}`);
		return feedReference.remove();
	}

    /**
       deleteFollowers
        1. Parent key is userId, so
        2. Everything in reference is deleted
        3. Use remove() versus iterating & multi-reference delete pattern(null)
        4. Used the rule used for feed - where the key(uid) had ".write": "auth.uid === $followedUid",
     */
	deleteFollowers(userIdToDelete): Promise<void> {
		const followersReference = this.database.list(`/followers/${userIdToDelete}`);
		return followersReference.remove();
	}

    /**
        data structure: people/userId/following/followedUserId/lastPostId
         TODO: rename to removeUserFromFollowing
         removes deleted user from followers following (in people location)
         Needed rule change in order to do this: // ".write": "auth.uid === $uid",
        ".write": "true",

     */

	deleteFollowingOfDeletedUser(deletedUser) {
		const peopleReference$ = this.database.list('/people')
			.snapshotChanges();


		return peopleReference$.switchMap((peopleSnapshotList) => {
			// Prepare for multi- reference update
			const updateObject = {};

			peopleSnapshotList.forEach((personSnapshot) => {
				// Prevent deleted user being involved
				if (personSnapshot.key !== deletedUser) {
					const follower = personSnapshot.key;
					// console.log('personSnapshot.payload.val()', personSnapshot.payload.val());
					const followingObject = personSnapshot.payload.val().following;
					const followingIds = Object.keys(followingObject);
					if (followingIds.includes(deletedUser)) {
						updateObject[`people/${follower}/following/${deletedUser}`] = null;
					}
				}
			});

			return Observable.fromPromise(this.database.object('/').update(updateObject));

		});
	}


	/** set up comments delete */


    /**
     * data structure looks like: *
     likes->post key->userId-> timestamp

     */


	deleteUserLikes(userUidToDelete) {
		// Get list of posts that are liked
		// Iterate through the children of the posts find posts where user
		//    - find posts that have deleted user's userId
		// add to ` likes/${postId}/${deletedUserid}` = null

		const updateObject = {};


		// TODO: development note: not using cramp order by key don't think it matters here
		const likesRef = this.database.list('/likes');

		// likePosts easier said than likedPosts(voice code)
		return likesRef.snapshotChanges()
			.take(1)
			.switchMap((likePosts) => {
				// TODO: what is a light post snapshot? include
				// it's an array of snapshots s you can't use key here
				console.log('likedPostsSnapshot', likePosts);
				// console.log('likedPosts', likePosts.key);
				likePosts.forEach((post) => {
					const postId = post.key;

					// object of current users who liked post
					const userIdsObject = post.payload.val();
					// userids now in a an array
					const userIds = Object.keys(userIdsObject);
					userIds.forEach((id) => {
						if (id === userUidToDelete) {
							updateObject[`likes/${postId}/${id}`] = null;
						}
					});

				});
				Observable.fromPromise(this.database.object('/').update(updateObject));
				return Observable.fromPromise(this.database.object('/').update(updateObject));
			});

	}
	deleteUserComments(userUidToDelete): Observable<void> {

		const commentsRef = this.database.list(`/comments/`, (ref) => {
			return ref.orderByKey();
		});

		// snapshotChanges versus valueChanges: need post key(keys) in order to complete reference delete
		return commentsRef.snapshotChanges()
			// stream once on the deletion action
			.take(1)
			.switchMap((list) => {
				// set up for multiple reference deletion
				const updateObject = {};
				const commentsList = list;
				// Really not needed just consistent with getting lists descending
				const commentsListReversed = _.reverse(commentsList);

				// need: `comments/postKey/commentKey`
				// Iteration 1: store post key
				commentsListReversed.forEach((commentSnapshot) => {
					const postKey = commentSnapshot.key;

					const commentsObject = commentSnapshot.payload.val();
					// Iterate through an object:  pattern
					const commentsKeys = Object.keys(commentsObject);
					// Iteration 2: author uid this child of comment key
					// IF author uid  === deleted userId then add reference to update object
					commentsKeys.forEach((commentKey) => {
						const commentUid = commentsObject[commentKey].author.uid;
						// console.log('uid', commentsObject[key].author.uid);
						if (commentUid === userUidToDelete) {
							updateObject[`comments/${postKey}/${commentKey}`] = null;
						}

					});

				});
				// Bulk or multi- reference update/deletion
				return Observable.fromPromise(this.database.object('/').update(updateObject));

			});


	}



}
