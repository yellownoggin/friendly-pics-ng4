import { Injectable } from '@angular/core';
import { CanActivate, Router } from "@angular/router";
import { AuthServiceFireChat } from "./auth.service";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authFireChat: AuthServiceFireChat, private router: Router) { }

  canActivate(): Observable<boolean> {
      return this.authFireChat.authState$
        .take(1)
        .map(authState => !!authState)
        .do(authenticated => {
            if (!authenticated) {
                this.router.navigate(['/sign-in']);
            }
        });
  }

}
