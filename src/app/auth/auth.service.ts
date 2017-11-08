/**
     Based on firechat auth approach
 */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Observable } from "rxjs/Observable";

export enum AuthProviders {
	Github = 0,
	Twitter = 1,
	Facebook = 2,
	Google = 3,
	Password = 4,
	Anonymouse = 5,
	Custom = 6
}


@Injectable()
export class AuthServiceFireChat {
    authState$: Observable<firebase.User>;
    user: any;

  constructor(private afAuth: AngularFireAuth) {
      this.user = null;
      this.authState$ = afAuth.authState;
      this.authState$.subscribe((user: firebase.User) => {
          this.user = user;
          console.log('authStat$ changed', this.user);
      });
  }

  	get authenticated(): boolean {
  		// if no user authState returns null
  		return this.user !== null;
  	}

  	get id(): string {
  		return this.authenticated ? this.user.uid : null;
  	}

  	// https://github.com/angular/angularfire2/issues/1183 for the Promise
  	// type that is needed. firebase.Promise<firebase.auth.UserCredential>
  	signIn(providerId: number): Promise<any> {
  		let provider: firebase.auth.AuthProvider = null;

  		switch (providerId) {
  			case AuthProviders.Github:
  				provider = new firebase.auth.GithubAuthProvider();
  				break;
  			case AuthProviders.Twitter:
  				provider = new firebase.auth.TwitterAuthProvider();
  				break;
  			case AuthProviders.Facebook:
  				provider = new firebase.auth.FacebookAuthProvider();
  				break;
  			case AuthProviders.Google:
  				// TODO: Only way to get auth provider with angular fire
  				provider = new firebase.auth.GoogleAuthProvider();
  				break;
  		}

  		return firebase.auth()
  			.signInWithPopup(provider)
  			.then((result: firebase.auth.UserCredential) => {
  				this.user = result.user;
  				// My code in order to save user data after simon
  				// Todo best pattern? j query application uses on authorization state change
  				return this.user;
  			}).catch((error: any) => {
  				// FirebaseError would not work
  				const errorCode = error.code;
  				const errorMessage = error.message;

  				if (errorCode === 'authService/account-exists-with-different-credential') {
  					alert('You have signed up with a different provider for that email');
  					// And the linking here if your app allows it.
  				} else {
  					// fire chat pattern is nothing here at this point
  				}
  				console.error('Error @ authService#signIn() :', error);
  			});


  	}

  	 signInWithGoogle() {
  	 	return this.signIn(AuthProviders.Google);
  	 }

     signOut(): void {
         this.afAuth.auth.signOut();
     }

}
