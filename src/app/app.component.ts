import { Component, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
// import { ngfModule, FileUploader, ngf } from 'angular-file';

// My components
import { AuthService } from './shared/providers/auth.service';
import { UploaderService } from './shared/uploader.service';

// Interfaces
import { FileReaderEvent} from './model/more';
import { Router } from '@angular/router';

@Component({
	selector: 'fp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [AuthService]
})


export class AppComponent implements OnInit, AfterViewInit {
	@ViewChild('picInput') picInput;
	currentFile: any;
	title = 'This acts as the Shell for the app.';
	a: any;
	splashShow: any;

	constructor(private _auth: AuthService, private renderer: Renderer2, private upload: UploaderService, private router: Router) { }

	ngOnInit(): void {
		this.watchAuthState();
	}

	ngAfterViewInit(): void {

	}
	/** Staging **/
	// console.log('event.target.value', event.target.value);
	// console.log('event.target.result', event.target.result);
	// console.log('event.target.files[0]', event.target.files[0]);
	// console.log('this.picInput', this.picInput);
	// console.log('this.picInput.nativeElement.value', this.picInput.nativeElement.value);
	//

	readPicture(event) {
		// clear previous stuff here
		// make a clear method
		this.upload.currentFile = null;
		this.upload.previewImageUrl = '';


		// Store file for later upload in service
		const file = event.target.files[0];
		this.upload.currentFile = file;

		// Clear selection in file picker && put
		this.clearFile(this.picInput);


		// Process file for preview  &  add picture
		if (file.type.match('image.*')) {
		// TODO: does not work with FileReader type(now is anywhich needs to be changed)
			const reader: FileReader = new FileReader();
			reader.onload = (e: FileReaderEvent) => {
				this.upload.previewImageUrl = e.target.result;
				this.router.navigate(['addPicture']);
			};

			reader.readAsDataURL(file);

		}


	}

	clearFile(element) {
		// console.log('element.nativeElement.files', element.nativeElement.files);
		element.nativeElement.value = '';
		// console.log('element.nativeElement.files', element.nativeElement.files);
	}


	clickInputFile() {
		// TODO: Needs reevaluation works in a browser, not best practice w/ Renderer2. Working on all platforms.
		// See https://trello.com/c/BRAhMopv/44-issues
		this.picInput.nativeElement.click();
	}

	// testFilesChange(files: File[]) {
	// 	const uploader: FileUploader = this.ngfVar.uploader;
	// 	console.log('files', files[0].lastModifiedDate);
	// 	// to HTML5 FormStat for transmission
	// 	const formData: FormData = uploader.getFormData(files);
	// 	console.log('formatData', );
	// }

	/** /Staging **/

	logOut() {

		this._auth.logOut().then(() => {
			// TODO: see auth service about not using whole class
			console.log('Signed out current userId: ', this._auth.authClass.auth.currentUser);
		});

	}

	logIn() {
		this._auth.logIn()
			.then((userCredentials) => {
				console.log(userCredentials);
			});
	}

	getCurrentUserUid() {
		console.log('getCurrentUserUid called');
		this.a = this._auth.getCurrentUser();

		if (this.a === null) {
			console.log('There is no user at the moment: ', this.a);
		} else {
			console.log('Current userId', this.a.uid);
		}

	}


	watchAuthState() {
		this._auth.authClass.auth
			.onAuthStateChanged((user) => {
				if (user === null) {
					this.splashShow = true;
					console.log('There is no user at the moment: ', user);
				} else {
					this.splashShow = false;
					console.log('Current userId', user);
				}
			});
	}


}
