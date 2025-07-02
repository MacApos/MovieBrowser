import {Component,inject, input, OnChanges} from '@angular/core';
import {MovieService} from "../movie.service";
import {ListComponent} from "../list/list.component";
import {Display, LanguageCode} from "../constants";
import {SpinnerComponent} from "../spinner/spinner.component";
import {NgTemplateOutlet} from "@angular/common";
import {TranslateDirective} from "@ngx-translate/core";

@Component({
    selector: 'app-search-list',
    imports: [
        ListComponent,
        SpinnerComponent,
        NgTemplateOutlet,
        TranslateDirective,
    ],
    template: `
        <ng-template #message let-translate="translate">
            <div class="d-flex justify-content-center align-items-center text-center">
                <h1 [translate]="translate" class="display-6"></h1>
            </div>
        </ng-template>
        
        @if (query().length < 3) {
            <ng-container [ngTemplateOutlet]="message"
                          [ngTemplateOutletContext]="{translate: 'search.searchSomething'}"/>
        } @else if (results) {
            @if (results.length) {
                <app-list [movies]="results" [display]="Display.list"/>
            } @else {
                <ng-container [ngTemplateOutlet]="message"
                              [ngTemplateOutletContext]="{translate: 'search.nothingFound'}"/>
            }
        } @else {
            <app-spinner/>
        }
    `,
    styles: ``
})
export class SearchListComponent implements OnChanges {
    language = input.required<LanguageCode>();
    query = input.required({transform: (value: string) => value ?? ""});

    movieService = inject(MovieService);

    results!: any;
    protected readonly Display = Display;

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
