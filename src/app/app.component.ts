import { Component, OnInit } from '@angular/core';

import { AuthService } from './shared/providers/auth.service';

@Component({
	selector: 'fp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [AuthService]
})
export class AppComponent implements OnInit {

	title = 'This acts as the Shell for the app.';
	a: any;
	splashShow: any;

	constructor(private _auth: AuthService) {


	}

	ngOnInit() {
		this.watchAuthState();
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
