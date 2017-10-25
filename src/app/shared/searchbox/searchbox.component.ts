import { StagingService } from '../../staging/staging.service';
import { Subject } from 'rxjs/Subject';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnChanges, Renderer2, ViewChild } from '@angular/core';

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
	// Not needed/originally used for RXJS Subject pattern
    myControl: FormControl =  new FormControl();
    @ViewChild ('search') searchInput: any;

	constructor(private staging: StagingService, private renderer: Renderer2 ) {
	}

	ngOnInit() {

        // console.log('search', search);
		this.staging.search(this.searchTerm$).subscribe((n) => {

			// TODO: see for in nested object question issue
			// formally there was a for in statement here
			// TODO: should generateArray be in the subscribed area or in the other part of the algorithm
			this.searchResults = this.generateArray(n);

		});

	}

	ngOnChanges() {

	}
    test() {

        const search = this.searchInput.nativeElement;
        console.log('search', search);
        // this.renderer.addClass(search, 'myNewClass');
        this.renderer.setAttribute(search, 'value', 'myNewClass');

    }
    consoleHello() {
        console.log('hello');
    }

	// TODO: itersate of objects in angulario quick fix
	generateArray(obj) {
		return Object.keys(obj).map((key) => {
			return { key: key, value: obj[key] };
		});
	}

}
