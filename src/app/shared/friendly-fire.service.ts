import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
// TODO: this is when the primary be using angularfire 4
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import { AuthService } from './providers/auth.service';

@Injectable()
export class FriendlyFireService {
	items: FirebaseListObservable<any[]>;
	pageSize: number;
	currentUser: any;

	get POST_PAGE_SIZE(): number {
		return 5;
	}

	constructor(private database: AngularFireDatabase, private auth: AuthService) {
		// this.pageSize = 5;
		this.currentUser = this.auth.getCurrentUser();
	}

	/**
	 * 	1. Shared methods (ie. addComment, etc..)
	 */
	// Staging


	getComments(postKey) {
		const query = this.database.list(`/comments/${postKey}`, {
			query: {
				orderByKey: true,
				limitToLast: 10
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

	// working on general feed

	// TODO: can I make this private is a good example since it's being used && things like get posts && not accessible from other components
	_getPaginatedFeed(uri, pageSize, earliestEntryId?, fetchPostDetails = false) {
		// TODO: can you extend query, like query.startAt, like angularfire1
		// not sharad asked the question right now so doing longform if
		let query = null;
		console.log(pageSize);
		const pageSizeOne = pageSize + 1;
		console.log(pageSizeOne);

		query = this.database.list(`/${uri}`,
			{
				query: {
					orderByKey: true,
					endAt: earliestEntryId,
					limitToLast: pageSizeOne

				}
			});



		// if (earliestEntryId) {
		// 	console.log('earliestEntryId', earliestEntryId);
		// 	console.log(pageSizeOne);
		// 	query = this.database.list(`/${uri}`,
		// 		{
		// 			query: {
		// 				orderByKey: true,
		// 				endAt: earliestEntryId,
		//                 limitToLast: pageSizeOne
		//
		// 			}
		// 		});
		//
		// } else {
		// 	console.log('else si called');
		// 	query = this.database.list(`/${uri}`,
		// 		{
		// 			query: {
		// 				orderByKey: true,
		// 				limitToLast: pageSizeOne
		// 			}
		// 		});
		//
		// }

		return query.map((data) => {
			console.log('map callled');
			const nextStartingId = data[0].$key;
			let nextPage = null;
			// console.log('data in the subscribe', data);
			// console.log('data key of the first element', nextStartingId);

			if (data.length > pageSize) {
				data.splice(0, 1);
			}
			// console.log('data after delete', data);

			nextPage = () => {
				return this._getPaginatedFeed(uri, pageSize, nextStartingId);
			};

			return [data, nextPage];
		});
		// query.subscribe((data) => {
		//     console.log('data', data);
		// });

		// return this.items = this.database.list(`/posts`, {
		//     query: {
		//         orderByKey: true,
		//         limitToLast: pageSize + 1
		//     }
		// });

		// If page size + 1 then we need to getthe earliest/oldest(the+1)
		// then save it for the post id to use for the next call(pagination)
		// latest entry id/earliest entry id?
		// when limiting to last number of posts on the query where is the earliest entry id located(oldest entry id, in this case the+1)


	}

	// End Of Staging


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
