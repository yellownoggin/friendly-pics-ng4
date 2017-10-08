import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/providers/auth.service';


@Component({
  selector: 'fp-app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
    componentName: string;

  constructor(private auth: AuthService) {

  }

  ngOnInit() {
      this.componentName = 'user page component';



  }

  getUserFeedPosts(uid) {
      /**
       * uid is taken from the url parameters
       */
  }

}
