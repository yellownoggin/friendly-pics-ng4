import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "../shared/providers/auth.service";
import { FirebaseApp } from 'angularfire2';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/from';
import * as latinize from "latinize";
import * as _ from "lodash";
import * as firebase from 'firebase';

@Injectable()
export class StagingService {
    storage: firebase.storage.Storage;
    // may need to import firebase
    // normalDatabase: firebase.database.Database;
    normalDatabase: any;

    constructor(private database: AngularFireDatabase, private authorization: AuthService, private app: FirebaseApp) {
        // need access to regular realtime database firebase api
        this.normalDatabase = this.app.database();
        this.storage = this.app.storage();
    }

	/**
        0. deleteUserComments
		1. search box
			logic & query & algorithm
			needs to be separated into component  &  friendly component
		2. Add new posts
			- logic/code
	 */


    /**
     * delete user
     */

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






















    /**
     * Search service staging
     * Browser event keyup  (focus/click)
     * Uses subject
     */

    search(terms) {
        const searchString = terms.toLowerCase().trim();
        return this.searchUsers(searchString, 10);
    }


    searchUsers(term, maxResults) {
        // Takes out all foreign punctuation(non-english letters)
        const searchString = latinize(term);

        const straightQuery = this.database.list('/people', (ref) => {
            return ref.orderByChild('_search_index/full_name').startAt(searchString).limitToLast(maxResults);
        });

        const reversedQuery = this.database.list('people', (ref) => {
            return ref.orderByChild('_search_index/reversed_full_name').startAt(searchString).limitToLast(maxResults);
        });

        // Turned into observables
        const straightQuery$ = straightQuery.snapshotChanges();
        const reversedQuery$ = reversedQuery.snapshotChanges();

        return Observable
            // first needed in order to make forkJoin work
            .forkJoin(straightQuery$.first(), reversedQuery$.first())
            .map((list) => {
                const people = {};
                // Combines list into one with nested for each loops
                // TODO: Could have used flatMap(quick drive did not work)
                list.forEach((item) => {
                    item.forEach((data) => {
                        people[data.key] = data.payload.val();
                    });

                });
                // console.log('people', people);
                // Represents userids combined with both reverse name && straight query
                const userIds = Object.keys(people);
                // Iterate & Filter out names that do not start with searchString
                userIds.forEach((userId) => {
                    // console.log('userId', userId);
                    const name = people[userId]['_search_index']['full_name'];
                    const reversedName = people[userId]._search_index.reversed_full_name;
                    if (!name.startsWith(searchString) && !reversedName.startsWith(searchString)) {
                        delete people[userId];
                    }

                });
                // console.log(people, 'people');

                const peopleArray = this.generateArray(people);
                // marcusd
                // TODO: Review this location of the fix and logix
                if (searchString === '') {
                    return [];
                } else {
                    return peopleArray;
                }


            });


    }

    generateArray(obj) {
        return Object.keys(obj).map((key) => {
            return { key: key, value: obj[key] };
        });
    }







    /**
        1. New Post Feature methods:
            * parent methods notifyForNewPosts, getOriginalPostCount
            * child methods* getFeedPostCountOnce, subscribeToHomeFeed
            * getFeedUri(helper method)
            * getUserId TODO: Refactor not used at the morment
     */

    // // TODO: make it so subscribing is not needed in ng onInit
    notifyForNewPosts(componentName, profileId?): Observable<number> {
        return this.subscribeToFeed(componentName).map((realTimePostLength) => {
            return realTimePostLength;
        });
    }

    // Get & saves original post count to work with real-time post update
    getOriginalPostCount(componentName) {
        // Set a promise for needed observable
        return this.getFeedPostCountOnce(componentName);
    }




    getFeedPostCountOnce(componentName, profileUid?) {
        return this.authorization.getAuthorizationState().map((user) => {
            return user.uid;
        }).switchMap((userId) => {
            const feedUri = this.getFeedUri(componentName, userId, profileUid);
            const feedCountPromise = this.normalDatabase.ref(feedUri)
                .once('value').then((snapshot) => {
                    const data = snapshot.val();
                    const entryIds = Object.keys(data);
                    const feedPostCount = entryIds.length;
                    return feedPostCount;
                });

            return Observable.fromPromise(feedCountPromise);
        });

    }

    subscribeToFeed(componentName, profileUid?) {
        return this.authorization.getAuthorizationState().map((user) => {
            return user.uid;
        }).switchMap((userId) => {
            const feedUri = this.getFeedUri(componentName, userId);
            const query = this.database.list(feedUri, (ref) => {
                return ref.orderByKey();
            });
            // TODO: do I need value changes here of course with observable you do
            return query.valueChanges().map((list) => {
                return list.length;
            });
        });

    }


    /**
     * Helper methods
     */
    // make this a service(method in the service)
    // todo: not used on all of methods that it could
    getUserId() {
        return this.authorization.getAuthState().map((user) => {
            return user.uid;
        });
    }


	/**
	 *  Relative component uri uses current userId or profile page userId when
	  	user feed posts
	 */
    getFeedUri(componentName, userId, profileUid?): string {
        let uri;
        componentName === 'home' || 'HomeFeedComponent'
            ? uri = `/feed/${userId}`
            : componentName === 'general' || 'GeneralComponent'
                ? uri = '/posts'
                : uri = '/poeple/${profileUid}/posts';

        return uri;
    }


}
