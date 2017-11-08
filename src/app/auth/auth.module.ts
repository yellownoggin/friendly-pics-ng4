import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthGuardService } from './unauth-guard.service';
import { AuthGuardService } from './auth-guard.service';
import { AuthServiceFireChat } from './auth.service';
import { WaitForAuthService } from './wait-for-auth.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [AuthServiceFireChat, UnauthGuardService, AuthGuardService, WaitForAuthService]
})
export class AuthModule { }
