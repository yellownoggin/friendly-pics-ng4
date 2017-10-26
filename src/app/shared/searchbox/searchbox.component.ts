import { StagingService } from '../../staging/staging.service';
import { Subject } from 'rxjs/Subject';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnChanges, Renderer2, ViewChild } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/startWith';
import { Router } from "@angular/router";


@Component({
	selector: 'fp-app-searchbox',
	templateUrl: './searchbox.component.html',
	styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit, OnChanges {
	searchResults: any ;
// Observable<object[]>
	searchText: any;
	// searchTerm$: any;
	searchTerm$: Subject<string> = new Subject();
	// Not needed/originally used for RXJS Subject pattern
	searchControl: FormControl = new FormControl();
	@ViewChild('search') searchInput: any;

	constructor(private staging: StagingService, private renderer: Renderer2, private router: Router) {
	}

	ngOnInit() {

		this.searchControl.valueChanges
			// 'Observes' observable in groups
			.debounceTime(400)
			// Alligator.Io operator suggestion
			.distinctUntilChanged()
			// Needed so no error his throne on first stream
			.startWith('')
			.switchMap((r) => {
				return this.staging.search(r);
			}).subscribe((r) => {
				this.searchResults = r;
			});

	}

	ngOnChanges() {

	}

	routeToUserSelected(key) {
		this.router.navigate(['user', key]);
	}

	// TODO: cannot iterate of objects in angulario quick fix
	generateArray(obj) {
		return Object.keys(obj).map((key) => {
			return { key: key, value: obj[key] };
		});
	}

}
