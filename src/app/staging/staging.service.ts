import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "../shared/providers/auth.service";
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class StagingService {
	// may need to import firebase
	// normalDatabase: firebase.database.Database;
	normalDatabase: any;

	constructor(private database: AngularFireDatabase, private authorization: AuthService, private app: FirebaseApp) {
		// need access to regular realtime database firebase api
		this.normalDatabase = this.app.database();
	}

	getHomeFeedPostCountOnce(userId) {
		return this.normalDatabase.ref(`/feed/${userId}`).once('value').then((snapshot) => {
			const data = snapshot.val();
			const entryIds = Object.keys(data);
			const feedPostCount = entryIds.length;
			return feedPostCount;
		});
	}
	getHomeFeedPostCount() {
		return this.authorization.getAuthorizationState().map((user) => {
			return user.uid;
		}).switchMap((userId) => {
			const query = this.database.list(`feed/${userId}`, (ref) => {
				return ref.orderByKey();
			});
			return query.valueChanges().map((list) => {
				return list.length;
			});
		});

	}

	subscribeToHomeFeed() {
		return this.authorization.getAuthorizationState().map((user) => {
			return user.uid;
		}).switchMap((userId) => {
			const query = this.database.list(`feed/${userId}`, (ref) => {
				return ref.orderByKey();
			});

			// TODO: do I need value changes here of course with observable you do

			return query.valueChanges().map((list) => {
				return list.length;
			});
		});

	}
}
