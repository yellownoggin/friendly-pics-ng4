import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AppMaterialModule } from './app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellComponent } from './shell/shell.component';

// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { GeneralComponent } from './general/general.component';
import { SplashComponent } from './splash/splash.component';
import { FriendlyFireService } from './shared/friendly-fire.service';
import { CommentsComponent } from './shared/comments/comments.component';
// import { SandComponent } from './sand/sand.component';

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
    CommentsComponent
    // SandComponent
  ],
  imports: [
    AppMaterialModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
