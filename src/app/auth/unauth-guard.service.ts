import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AuthServiceFireChat } from "./auth.service";
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

@Injectable()
export class UnauthGuardService {

	constructor(private auth: AuthServiceFireChat) { }

	canActivate(): Observable<boolean> {
		return this.auth.authState$
			.take(1)
			.map((authState) => {
                console.log('authState', authState);
                return !!authState;
            });
	}

}
