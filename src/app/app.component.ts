import { Component, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
// import { ngfModule, FileUploader, ngf } from 'angular-file';

// My components
import { AuthService } from './shared/providers/auth.service';
import { UploaderService } from './shared/uploader.service';

// Interfaces
import { FileReaderEvent } from './model/more';
import { Router } from '@angular/router';
import { FriendlyFireService } from './shared/friendly-fire.service';

@Component({
	selector: 'fp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [AuthService]
})


export class AppComponent implements OnInit, AfterViewInit {
	readPicture: (event: any) => void;
	@ViewChild('picInput') picInput;
	currentFile: any;
	title = 'This acts as the Shell for the app.';
	a: any;
	splashShow: any;

	constructor(private _auth: AuthService, private renderer: Renderer2,
		private upload: UploaderService, private router: Router, private friendly: FriendlyFireService) {
		this.readPicture = (e) =>  upload.readPicture(e);
	}

	ngOnInit(): void {
		this.watchAuthState();

	}

	ngAfterViewInit(): void {

	}

	/** /Staging **/

	deleteTsf() {
		this.friendly.deleteTsf();
	}


	triggerInputFile() {
		// TODO: Renderer2. Working on all platforms?
		// See https://trello.com/c/BRAhMopv/44-issues
		this.picInput.nativeElement.click();
	}




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
