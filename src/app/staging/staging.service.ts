import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "../shared/providers/auth.service";
import { FirebaseApp } from 'angularfire2';
import { Observable } from "rxjs/Observable";

@Injectable()
export class StagingService {
    // may need to import firebase
    // normalDatabase: firebase.database.Database;
    normalDatabase: any;

    constructor(private database: AngularFireDatabase, private authorization: AuthService, private app: FirebaseApp) {
        // need access to regular realtime database firebase api
        this.normalDatabase = this.app.database();
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



    // TODO: Am I using this?
    getHomeFeedPostCount(componentName, profileUid?) {
        return this.authorization.getAuthorizationState().map((user) => {
            return user.uid;
        }).switchMap((userId) => {
            const feedUri = this.getFeedUri(componentName, userId);
            const query = this.database.list(feedUri, (ref) => {
                return ref.orderByKey();
            });
            return query.valueChanges().map((list) => {
                return list.length;
            });
        });

    }


    subscribeToHomeFeed(componentName, profileUid?) {
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
}
