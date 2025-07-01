import {Component, effect, inject, input, Input, OnChanges, signal} from '@angular/core';
import {MovieService} from "../movie.service";
import {ListComponent} from "../list/list.component";
import {Display, LanguageCode} from "../constants";
import {SpinnerComponent} from "../spinner/spinner.component";

@Component({
    selector: 'app-search-list',
    imports: [
        ListComponent,
        SpinnerComponent,
    ],
    template: `
        @if (query().length < 3) {
            <div>search something</div>
        } @else if (results) {
            @if (results.length) {
                <app-list [movies]="results" [display]="Display.list"/>
            } @else {
                <div>nothing found</div>
            }
        } @else {
            <app-spinner/>
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

    protected readonly Display = Display;
}
