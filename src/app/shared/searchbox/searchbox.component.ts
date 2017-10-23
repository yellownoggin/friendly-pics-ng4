import { StagingService } from '../../staging/staging.service';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
	selector: 'fp-app-searchbox',
	templateUrl: './searchbox.component.html',
	styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit, OnChanges {
	searchResults: {
	};
	searchText: any;
	// searchTerm$: any;
	searchTerm$: Subject<string> = new Subject();
	constructor(private staging: StagingService) {
	}

	ngOnInit() {
		this.staging.search(this.searchTerm$).subscribe((n) => {
            
			// TODO: see for in nested object question issue
			// formally there was a for in statement here
			// TODO: should generateArray be in the subscribed area or in the other part of the algorithm
			this.searchResults = this.generateArray(n);

		});

	}

	ngOnChanges() {

	}

	// TODO: itersate of objects in angulario quick fix
	generateArray(obj) {
		return Object.keys(obj).map((key) => {
			return { key: key, value: obj[key] };
		});
	}

}
