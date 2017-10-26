import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule,  MatAutocompleteModule } from '@angular/material';


@NgModule({
    imports: [MatButtonModule, MatIconModule, MatAutocompleteModule],
    exports: [MatButtonModule, MatIconModule, MatAutocompleteModule],
})

export class AppMaterialModule {}
