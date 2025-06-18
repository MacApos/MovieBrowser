import {Component, effect, inject, input, Input, OnChanges, signal} from '@angular/core';
import {MovieService} from "../movie.service";
import {ListComponent} from "../list/list.component";
import {LanguageCode} from "../constants";

@Component({
    selector: 'app-search-list',
    imports: [
        ListComponent,
    ],
    template: `
        @if (query().length < 3) {
            <div>search something</div>
        } @else if (results) {
            @if (results.length > 0) {
                <app-list [language]="language()" [movies]="results"/>
            } @else {
                <div>nothing found</div>
            }
        } @else {
            <div>spinner</div>
        }
    `,
    styles: ``
})
export class SearchListComponent implements OnChanges {
    movieService = inject(MovieService);
    results!: any;

    language = input.required<LanguageCode>();
    query = input.required({transform: (value: string) => value ?? ""});

    ngOnChanges(): void {
        const query = this.query();
        if (query && query.length > 2) {
            const language = this.language();
            this.movieService.searchMovie(query, language).subscribe(response => {
                this.results = response;
            });
        }
    }
}
