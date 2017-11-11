import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule,  MatAutocompleteModule, MatCardModule } from '@angular/material';


@NgModule({
    imports: [MatButtonModule, MatIconModule, MatAutocompleteModule, MatCardModule],
    exports: [MatButtonModule, MatIconModule, MatAutocompleteModule, MatCardModule],
})

export class AppMaterialModule {}
