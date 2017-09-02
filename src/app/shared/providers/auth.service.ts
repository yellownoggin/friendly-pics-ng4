import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'd lose the tree shaking benefits
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {



	authClass: any;

	constructor(public afAuth: AngularFireAuth) {
		// TODO: 1. probably don't need this use a method to get what you want
		// like get current user
		// 2. getters and setters
		this.authClass = this.afAuth;
	}

	logIn() {

		return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());


	}

	logOut() {
		return this.afAuth.auth.signOut();
	}

	getAuthState() {
		return this.afAuth.authState;
		//   return this.afAuth.idToken;
	}

	getCurrentUser() {
		return this.afAuth.auth.currentUser;
	}
}
