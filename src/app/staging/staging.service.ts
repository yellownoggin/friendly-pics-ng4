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
import * as latinize from "latinize";
@Injectable()
export class StagingService {
	// may need to import firebase
	// normalDatabase: firebase.database.Database;
	normalDatabase: any;

	constructor(private database: AngularFireDatabase, private authorization: AuthService, private app: FirebaseApp) {
		// need access to regular realtime database firebase api
		this.normalDatabase = this.app.database();
	}


    /**
     * Search service staging
     * Browser event keyup  (focus/click)
     * Uses subject
     */

	search(terms: Observable<string>) {
		console.log('triggered');

		return terms.debounceTime(400)
			// TODO: distinctUntilChanged
			// not working as explained (shouldn't repeat)
			// works with or without it
			.distinctUntilChanged()
			.switchMap((term) => {
				// console.log(term);
				const searchString = term.toLowerCase().trim();
				console.log(searchString);
				// minimum characters ?
				// return term;
				return this.searchUsers(searchString, 10);
			});
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
				console.log('list', list);
				const people = {};
				// Combines list into one with nested for each loops
				// TODO: Could have used flatMap(quick drive did not work)
				list.forEach((item) => {
					item.forEach((data) => {
						people[data.key] = data.payload.val();
					});

				});
				console.log('people', people);
				// Represents userids combined with both reverse name && straight query
				const userIds = Object.keys(people);
				// Iterate & Filter out names that do not start with searchString
				userIds.forEach((userId) => {
					console.log('userId', userId);
					const name = people[userId]['_search_index']['full_name'];
					const reversedName = people[userId]._search_index.reversed_full_name;
					if (!name.startsWith(searchString) && !reversedName.startsWith(searchString)) {
						delete people[userId];
					}

				});
				console.log(people, 'people');

				// Issue2 don't show results if there is nothing being searched
				if (searchString === '') {
					return {};
				} else {
					return people;
				}


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
	notifyForNewPosts(componentName): Observable<number> {
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
			const feedUri = this.getFeedUri(componentName, userId);
			console.log('uri', feedUri);
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

	getFeedUri(componentName, userId, profileUid?) {
		let uri;
		componentName === 'home' || 'HomeFeedComponent'
			? uri = `/feed/${userId}`
			: componentName === 'general' || 'GeneralComponent'
				? uri = '/posts'
				: uri = '/poeple/${profileUid}/posts';

		return uri;
	}


}
