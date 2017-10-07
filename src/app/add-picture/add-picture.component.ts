import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UploaderService } from '../shared/uploader.service';
import { FriendlyFireService } from '../shared/friendly-fire.service';
import { Router } from '@angular/router';

@Component({
	selector: 'fp-add-picture',
	templateUrl: './add-picture.component.html',
	styleUrls: ['./add-picture.component.css']
})


export class AddPictureComponent implements OnInit, AfterViewInit {
	previewImage: string;
	// TODO: try object here
	currentFile: any;

	constructor(private friendly: FriendlyFireService, private upload: UploaderService, private router: Router) {
		this.previewImage = this.upload.previewImageUrl;
		this.router = router;

	}

	ngOnInit() {
		this.currentFile = this.upload.currentFile;
		console.log(' this.currentFile', this.currentFile);

	}

	ngAfterViewInit(): void {
		//   this.previewImage = this.upload.previewImageUrl;
		//   console.log(' this.previewImag i n after a minute',  this.previewImage);
	}


	// TODO: should this be an upload service?

	uploadPic(fObject: any) {
		console.log('caption: ', fObject.imageCaption);
		// 1. STORE:  image caption from form
		// 2.
		const imageCaption = fObject.imageCaption;

		this.upload.generateImages().then(blob => {
			// Upload the file upload 2 firebase storage & create new post
			this.friendly.uploadNewPicture(blob.full, blob.thumb, this.upload.currentFile.name, imageCaption)
			.then((postId) => {
				// TODO: commands first argument?faq(how do you go to path: '' )
				// Answer: needs be an array
				this.router.navigate(['']);
				// TODO: messages: sweetalert(toast) here
				console.log('New picture has been posted: ', postId);
				// Check to see the current file and preview image are empty if not clear
				console.log('checking preview image: ',  this.upload.previewImageUrl);
				console.log('checking current file: ',  this.upload.currentFile);

			});
		});
	}

}
