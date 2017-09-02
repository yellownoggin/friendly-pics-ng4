import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './shell.component.html'
})
export class ShellComponent implements OnInit {

      // title = 'ShellComponent';

  constructor() { }

  ngOnInit() {
      console.log('ShellComponent');
  }

}
