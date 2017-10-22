import { StagingService } from '../../staging/staging.service';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'fp-app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit, OnChanges {
    searchText: any;
    // searchTerm$: any;
    searchTerm$: Subject<string> = new Subject();
  constructor(private staging: StagingService) { }

  ngOnInit() {
      this.staging.testLatinize();
  }

  ngOnChanges() {

  }


  checkSearchBox() {

      console.log(this.searchText);
  }

}
