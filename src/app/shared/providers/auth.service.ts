import { Injectable } from '@angular/core';
import { GoogleUserData } from '../../model/more';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'd lose the tree shaking benefits
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class AuthService {
	user: any;
	authState$: Observable<firebase.User>;
	authClass: any;

	constructor(private afAuth: AngularFireAuth) {
		this.authClass = this.afAuth;
	}


	// Promised<userCredential> needs model
	useGoogleProvider(): Promise<GoogleUserData> {
		return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
	}

	logIn() {
		return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
	}

	logOut() {
		return this.afAuth.auth.signOut();

	}

	getAuthState() {
		return this.afAuth.authState;
	}

	// see get authenticated
	getAuthorizationState() {
		return this.afAuth.authState;
		//   return this.afAuth.idToken;
	}

	getCurrentUser() {
		return this.afAuth.auth.currentUser;
	}

}
