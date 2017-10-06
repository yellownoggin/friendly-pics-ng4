import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { PromiseD, HTMLInputEvent, FileReaderEvent} from '../model/more';
import { Router } from '@angular/router';

@Injectable()
export class UploaderService {
	__currentFile: any;
	__previewImageUrl: string;

	get previewImageUrl(): string {
		// console.log('preview image url works');
		// return 'hello from the preview image url get';
		console.log('truncated preview image in the getter', _.truncate(this.__previewImageUrl, { 'length': 100 }));
		return this.__previewImageUrl;
	}

	set previewImageUrl(newUrl: string) {

		this.__previewImageUrl = newUrl;
		console.log('truncated preview image', _.truncate(this.__previewImageUrl, { 'length': 100 }));
		//  console.log('this._previewImageUrl', this._previewImageUrl);
	}


	// TODO: <Object> did not work as a type moments 4 the file not sure how to do it
	get currentFile(): any {
		console.log('current file get works');
		return this.__currentFile;
	}


	set currentFile(newFile: any) {
		this.__currentFile = newFile;
		//  console.log('this._previewImageUrl', this._previewImageUrl);
	}

	static get Full_Image_Specs() {
		return {
			maxDimensions: 1280,
			quality: 0.9
		};
	}

	// What is this Object doing bc:
	// It does not cause and error when returning a string
	static get Thumb_Image_Specs(): Object {
		return {
			maxDimensions: 640,
			quality: 0.7
		};
	}


	constructor(private router: Router) { }


    // Store  &  converts input file for preview & upload
	readPicture(event: HTMLInputEvent) {
		// clear previous stuff here
		// make a clear method
		this.currentFile = null;
		this.previewImageUrl = '';
        const that = this;
        console.log('this', this);

        // TODO: test this
        const pictureInput = event.target;

		// Store file for later upload in service
		const file = event.target.files[0];
		 this.currentFile = file;

		// Clear selection in file picker && put
		this.clearFile(pictureInput);

		// Process file for preview  &  add picture
		if (file.type.match('image.*')) {
			const reader: FileReader = new FileReader();
			reader.onload = (e: FileReaderEvent) => {
				this.previewImageUrl = e.target.result;
				this.router.navigate(['addPicture']);
			};
			reader.readAsDataURL(file);
		}
	}


    /**
     * Creates blobs from the files chosen in add picture
     * Returns them as promises
     TODO: is this the right promise type empty object(changed to any)
     */
	generateImages(): Promise<any> {
		/** 1. Convert: chosen file to data url
		 * 3.
		*/

		// 1. Convert: chosen file to data url
		const reader = new FileReader();
		const readerPromise = new Promise((resolve) => {
			reader.onload = resolve;
		});

		reader.readAsDataURL(this.currentFile);

		const blobPromises = readerPromise.then((e: any ) => {
			const url = e.target.result;
			const image = new Image();
			image.src = url;

			// get thumb blob
			// maxFromTheMentions storage here
			const thumbCanvas = this._getScaledCanvas(image, UploaderService.Thumb_Image_Specs);
			const thumbBlobPromise = new Promise(resolve => {
				// .9 should be a variables
				thumbCanvas.toBlob(resolve, 'image/jpeg', .9);
			});



			// get full blob
			// maxFullDimensions storage here
			const fullCanvas = this._getScaledCanvas(image, UploaderService.Full_Image_Specs);
			const fullBlobPromise = new Promise(resolve => {
				// .9 should be a variables
				fullCanvas.toBlob(resolve, 'image/jpeg', .9);
			});

			return Promise.all([thumbBlobPromise, fullBlobPromise])
				.then(blobs => {
					return {
						thumb: blobs[0],
						full: blobs[1]
					};
				});

		});
		return blobPromises;

	}



    /**
     * Converts ImageDataURL to Canvas Scales
     */
	_getScaledCanvas(image, maxDimensions) {

		const theCanvas = document.createElement('canvas');
		if (image.width > maxDimensions || image.height > maxDimensions) {
			// then scale them down to size depending on which 1 is greater than the maxtor mentions
			if (image.width > image.height) {
				theCanvas.width = maxDimensions;
				theCanvas.height = maxDimensions * image.height / image.width;
			} else {
				theCanvas.height = maxDimensions;
				theCanvas.width = maxDimensions * image.width / image.height;
			}
		} else {
			theCanvas.width = image.width;
			theCanvas.height = image.height;
		}
		theCanvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height, 0, 0, theCanvas.width, theCanvas.height);
		return theCanvas;

	}

	clearFile(element) {
		console.log('element.nativeElement.files in uploader helper', element.files[0]);
		element.value = '';
		console.log('element.nativeElement.files in uploader helper', element.files);
	}

}
