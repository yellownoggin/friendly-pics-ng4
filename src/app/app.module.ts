import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from './app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ngfModule, FileUploader, ngf } from 'angular-file';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellComponent } from './shell/shell.component';

// New imports to update based on AngularFire2 version 4
import { AngularFireModule } from 'angularfire2';
import 'firebase/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { GeneralComponent } from './general/general.component';
import { SplashComponent } from './splash/splash.component';
import { FriendlyFireService } from './shared/friendly-fire.service';
import { CommentsComponent } from './shared/comments/comments.component';
import { LikeComponent } from './shared/like/like.component';
import { AddPictureComponent } from './add-picture/add-picture.component';
import { UploaderService } from './shared/uploader.service';
import { AuthService } from './shared/providers/auth.service';
import { PostComponent } from './post/post.component';
import { UserPageComponent } from './user-page/user-page.component';
import { HomeFeedComponent } from './home-feed/home-feed.component';
import { StagingService } from './staging/staging.service';
import { SearchboxComponent } from './shared/searchbox/searchbox.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';


export const firebaseConfig = {
	apiKey: 'AIzaSyD9ItMOV_b4PlU0P68uerXoUDG_oqi74cg',
	authDomain: 'friendlypix-angular1.firebaseapp.com',
	databaseURL: 'https://friendlypix-angular1.firebaseio.com',
	projectId: 'friendlypix-angular1',
	storageBucket: 'friendlypix-angular1.appspot.com',
	messagingSenderId: '428223190133'
};

@NgModule({
	declarations: [
		AppComponent,
		ShellComponent,
		GeneralComponent,
		SplashComponent,
		CommentsComponent,
		LikeComponent,
		AddPictureComponent,
		PostComponent,
		UserPageComponent,
		HomeFeedComponent,
		SearchboxComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		FlexLayoutModule,
        BrowserAnimationsModule,
        AppMaterialModule,
		FormsModule,
		ReactiveFormsModule,
		AuthModule
	],
	providers: [UploaderService, FriendlyFireService, AuthService, StagingService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
