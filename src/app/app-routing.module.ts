import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellComponent } from './shell/shell.component';
import { AppComponent } from './app.component';
import { GeneralComponent } from './general/general.component';
import { AddPictureComponent } from './add-picture/add-picture.component';
import { UserPageComponent } from './user-page/user-page.component';
import { PostComponent } from './post/post.component';
import { HomeFeedComponent } from './home-feed/home-feed.component';
// import { SandComponent } from './sand/sand.component';

const routes: Routes = [
  { path: '', component: GeneralComponent },
  { path: 'addPicture', component: AddPictureComponent },
  { path: 'user/:id', component: UserPageComponent },
  { path: 'post/:postId', component: PostComponent },
  { path: 'home', component: HomeFeedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
