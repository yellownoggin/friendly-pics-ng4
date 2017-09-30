import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellComponent } from './shell/shell.component';
import { AppComponent } from './app.component';
import { GeneralComponent } from './general/general.component';
import { AddPictureComponent } from './add-picture/add-picture.component';
// import { SandComponent } from './sand/sand.component';

const routes: Routes = [
  { path: '', component: GeneralComponent },
  { path: 'addPicture', component: AddPictureComponent }
  // { path: 'sand', component: SandComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
