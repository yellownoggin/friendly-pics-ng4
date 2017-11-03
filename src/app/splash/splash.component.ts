import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AuthService } from '../shared/providers/auth.service';
import { StagingService } from "../staging/staging.service";
import { GoogleUserData } from '../model/more';




@Component({
	selector: 'fp-splash',
	templateUrl: './splash.component.html',
	styleUrls: ['./splash.component.css']
})

export class SplashComponent implements OnInit, OnChanges {

	@Input() splashIt: any;

	user: any;
	signIn: any;
	a: any;
	x: any;
	_auth: any;

	constructor(private auth: AuthService, private router: Router, private staging: StagingService) {
		//    this.user = this._auth.getCurrentUser();
		//    this.user = 'fred';
	}

	ngOnInit() {
		// firechat pattern


		// old code
		this._auth = this.auth;
		this.user = this._auth.getCurrentUser();
		this.x = this._auth;
		this.x = 'this._auth';
		//   if (this.user === null) {
		//       this.user = 'There is no user.';
		//   }
	}

	ngOnChanges() {
		// Bool used on ng if div in template
		// (determined by the app component)
		this.user = this.splashIt;
	}

	/**
	 * FireChat pattern
	 */


	signInWithGoogle(): void {
		this.auth.signInWithGoogle()
			.then((user: GoogleUserData) => this.postSignIn(user));
	}

	postSignIn(user: GoogleUserData): Promise<void> {
		this.router.navigate(['/home']);

		// Pattern correct taking care of save user data promise here returning clean simple arrow in parent method
		return this.staging
			.saveUserData(user.photoURL, user.displayName, user.uid)
			.then(() => {
				console.log('Saving user data succeeded ');
			})
			.catch((error: any) => console.error('Error in saving user data'));
	}






	/**
	 * Old Code
	 */

	// signInWithGoogle() {
	// 	this._auth.useGoogleProvider().then((result) => {
	// 		console.log('this._auth', this._auth);
	// 		console.log('results use google provider', result);
	//
	// 		// TODO: Friendly pix uses the app wide user id
	// 		// instead of the uid from the auth data information
	// 		// thought that the their way may ensure that the app see's the auth.?
	// 		 return this.staging.saveUserData(result.user.photoURL, result.user.displayName, result.user.uid);
	// 	});
	// }

	logIn() {
		this._auth.logIn()
			.then((userCredential) => {
				console.log('Signed in current userId: ', userCredential.user.uid);
				this.router.navigate(['']);
			})
			.catch((error) => {
				console.log('Error in sign in with pop-up: ', error);
			});
	}

	logout() {
		this._auth.logOut();
	}

	// TODO: trailing white spaces
	// getAuthState()  {
	//
	// }
	//

	getCurrentUser() {
		this.a = this._auth.getCurrentUser();
		console.log(this.a);
	}

	getCurrentUserUid() {
		this.a = this._auth.getCurrentUser();

		if (this.a === null) {
			console.log('There is no user at the moment: ', this.a);
		} else {
			console.log('Current userId', this.a.uid);
		}

	}


}
