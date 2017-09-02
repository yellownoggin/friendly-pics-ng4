import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AuthService } from '../shared/providers/auth.service';


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

	constructor(private _auth: AuthService, private router: Router) {
		//    this.user = this._auth.getCurrentUser();
		//    this.user = 'fred';
	}

	ngOnInit() {
		this.user = this._auth.getCurrentUser();
		this.x = this._auth;
		this.x = 'this._auth';
		//   if (this.user === null) {
		//       this.user = 'There is no user.';
		//   }
	}

	ngOnChanges() {
		this.user = this.splashIt;
	}

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
