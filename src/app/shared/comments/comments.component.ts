import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { FriendlyFireService } from '../friendly-fire.service';

@Component({
  selector: 'fp-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnChanges {
    @Input() postKey: any;
    key: any;
    comments: any;

  constructor(private friendly: FriendlyFireService) { }

  ngOnInit() {
  }

  ngOnChanges() {
      this.key = this.postKey;
      this.friendly.getComments(this.postKey)
        .subscribe((data) => {
            console.log('data', data);
             this.comments  = data;
        });


  }

}
