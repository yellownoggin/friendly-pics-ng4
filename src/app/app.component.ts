import { Component, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
// import { ngfModule, FileUploader, ngf } from 'angular-file';
import { Router } from '@angular/router';
import { FriendlyFireService } from './shared/friendly-fire.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

// My components
import { AuthService } from './shared/providers/auth.service';
import { UploaderService } from './shared/uploader.service';

// Interfaces
import { FileReaderEvent } from './model/more';



@Component({
	selector: 'fp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [AuthService]
})


export class AppComponent implements OnInit, AfterViewInit {
	currentUserUid: string;
	getCurrentUser: () => Observable<firebase.User>;
	readPicture: (event: any) => void;
	@ViewChild('picInput') picInput;
	currentFile: any;
	title = 'This acts as the Shell for the app.';
	a: any;
	splashShow: any;

	constructor(private _auth: AuthService, private renderer: Renderer2,
		private upload: UploaderService, private router: Router, private friendly: FriendlyFireService) {
		this.readPicture = (e) => upload.readPicture(e);

		this.getCurrentUser = () => {
			return _auth.getAuthState();
		};

	}

	ngOnInit(): void {

		this.watchAuthState();
		this.getCurrentUser().subscribe(
			(user) => {
				this.currentUserUid = user.uid;
				console.log('uid in app:', this.currentUserUid);
			}
		);

	}

	ngAfterViewInit(): void {

	}


	/** /stagingy **/

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



	/**
		Need here in component
    	1. parent component of others
    	2. controls splash global app var(for better words)
	 */

	watchAuthState() {
		this._auth.authClass.auth
			.onAuthStateChanged((user) => {
				// Reload the browser help with new userState propagation
				// Re instantiates the component data
				// window.location.reload();
				console.log('on off state changed called');
				if (user === null) {
					this.splashShow = true;
					console.log('There is no user at the moment: ', user);
				} else {
					this.splashShow = false;
					console.log('Current userId', user);
				}

			});
			// why won't below work as an observer
			// TODO: t is not a function onAuthStateChanged
			// come back to this
			// take out map can't take or does not make sense
			// .take(1)
			// .map((user) => {
			// 	// Reload the browser help with new userState propagation
			// 	// Re instantiates the component data
			// 	// window.location.reload();
			// 	console.log('on off state changed called');
			// 	if (user === null) {
			// 		this.splashShow = true;
			// 		console.log('There is no user at the moment: ', user);
			// 	} else {
			// 		this.splashShow = false;
			// 		console.log('Current userId', user);
			// 	}
			//
			// });
	}


	/**
	 * DELETE USER wrappers
	 * TODO: Re-factor to 1 method
	 */

	deleteUserPeople() {
		this.friendly.deleteUserPeople('6m1TUlYQFDUVMq4UtGxBYA1TwF32')
			.then((response) => {
				console.log('Person Deleted');
			})
			.catch((e) => {
				console.log('Error in deleteUserPeople: ', e);
			});
	}

	deleteUserPostsAll() {
		this.friendly.deleteUserPostsAll('6m1TUlYQFDUVMq4UtGxBYA1TwF32')
			.subscribe((n) => {
				console.log('n', n);
			});
	}

	deleteFollowingOfDeletedUser() {
		this.friendly
			.deleteFollowingOfDeletedUser('6m1TUlYQFDUVMq4UtGxBYA1TwF32')
			.subscribe((n) => {
				console.log('n', n);
			});
	}


	deleteUserFollowers() {
		this.friendly.deleteFollowers('NTYKPSpfnxTdu6P8GAtJB7LJPkI3')
			.then((response) => {
				console.log('response', response);
			});
	}



	deleteUserFeed(): void {
		this.friendly.deleteUserFeed('6m1TUlYQFDUVMq4UtGxBYA1TwF32')
			.then((n) => {
				console.log('n', n);
			});
	}

	deleteUserLikes() {
		this.friendly.deleteUserLikes('iNRpsaQBd9ZfVnxs1Or448I16Xm2')
			.subscribe((n) => {
				console.log('n', n);
			});
	}

	deleteUserComments() {
		this.friendly.deleteUserComments('iNRpsaQBd9ZfVnxs1Or448I16Xm2')
			.subscribe((n) => {
				console.log('next in delete comments', n);
			});
	}


}
