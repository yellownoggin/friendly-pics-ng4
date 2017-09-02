import { Injectable } from '@angular/core';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import * as _ from 'lodash';


@Injectable()
export class FeedService {

    constructor(db: AngularFireDatabaseModule) { }

	getGeneralFeed() {

	}


    // Feed helper methods

    // TODO:  This to not work should I have a helper method for this
    // maybe you have this return && then bind in the app component
    // addNextPage(nextBinding, feedBinding) {
    //     console.log('making sure its called && next page in feed');
    //     nextBinding().subscribe((data) => {
    //         // concatenate reversed friendlyPosts from next stage method
    //         let nextPagePosts = data[0];
    //         // making so descending order
    //         nextPagePosts = _.reverse(nextPagePosts);
    //         feedBinding = _.concat(nextPagePosts, feedBinding);
    //         nextBinding = data[1];
    //     });
    // 
    // }



}
