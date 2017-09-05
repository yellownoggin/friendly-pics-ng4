import { Component, Input, OnInit, OnChanges } from '@angular/core';

// import { NgForm } from '@angular/forms';

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
	comment: string;

	constructor(private friendly: FriendlyFireService) { }

	// TODO: needed?
	ngOnInit() {
	}

	ngOnChanges() {
		this.key = this.postKey;
		this.friendly.getComments(this.postKey)
			.subscribe((data) => {
				this.comments = data;
			});
	}


	submitComment(commentValue) {
		// Clear input field when submitted
		this.comment = '';

		if (!commentValue || commentValue.length === 0) {
			console.log('No Comment value returned without submitting,');
			return;
		}

		this.friendly.addComment(commentValue, this.postKey);
	}

}
