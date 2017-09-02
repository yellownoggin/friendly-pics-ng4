import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FriendlyFireService } from '../shared/friendly-fire.service';



@Component({
  selector: 'fp-sand',
  templateUrl: './sand.component.html',
  styleUrls: ['./sand.component.css'],
  providers: [FriendlyFireService]
})
export class SandComponent implements OnInit {

next: any;

    constructor(private friendly: FriendlyFireService, private database: AngularFireDatabase) { }

  ngOnInit() {
     this.getSandPosts();

  }

  getNext() {
      this.next().subscribe((b) => {
          console.log('b', b);
           this.next = b[1];
      });

  }

  getSandPosts(key?) {
       this
            ._getPaginatedFeedSand('/posts', this.friendly.POST_PAGE_SIZE, key)
            .subscribe((a) => {
                console.log(a);
                this.next = a[1];
            });
  }

  _getPaginatedFeedSand(uri, pageSize, earliestEntryId, fetchPostDetails = false) {
      // TODO: can you extend query, like query.startAt, like angularfire1
      // not sharad asked the question right now so doing longform if
      let query = null;
      const pageSizeOne = pageSize + 1;

      console.log('sand is called eid', earliestEntryId);
      query = this.database.list(`/${uri}`,
          {
              query: {
                  orderByKey: true,
                  endAt: earliestEntryId,
                  limitToLast: pageSizeOne
              }
          });




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
              return this._getPaginatedFeedSand(uri, pageSize, nextStartingId);
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

}
