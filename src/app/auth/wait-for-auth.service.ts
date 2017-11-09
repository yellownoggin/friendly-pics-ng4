import { Injectable } from '@angular/core';
import { AuthServiceFireChat } from "./auth.service";
import { Observable } from "rxjs/Observable";

/**
    Logic: Provides buffer so services/routes that need current user state/id
    will have it.
 */


@Injectable()
export class WaitForAuthService {

	constructor(private auth: AuthServiceFireChat) { }

	canActivate(): Observable<boolean> {
		return this.auth.authState$
			.map((authState) => {
				// turn it into a booleon
				const authorizationState = !!authState;

				if (authorizationState) {
                    // IF authorized return true(as is)
					const authorized = authorizationState;
					return authorized;
				} else {
                    // IF not authorized still return true
                    const unauthorized = authorizationState;
					return !unauthorized;
				}


			});

	}

}
