import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "../shared/providers/auth.service";
import { FirebaseApp } from 'angularfire2';
import { Observable } from "rxjs/Observable";
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

    testLatinize() {
        const creme = latinize('crème brûlée');
        console.log(creme);
        

    }

    search(terms: Observable<string>) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap((term) => {
                console.log(term);
                const searchString = term.toLowerCase().trim();
                console.log(searchString);
                // minimum characters ? 
                return this.searchUsers(searchString, 10);
            });
    }


    searchUsers(term, maxResults) {
        return term;
        /**
         * 1. latinize sting and lowercase again 
         * 2. query regular 
         * 3. query reversed full name 
         * 4. observe all ()
         * 5. get the list and see the data type 
         *      - need to delete the names that are in there that the do not start with the searchString
         */

        //  latinize 
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
