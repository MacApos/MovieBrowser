import {Component, effect, inject, input, Input, OnChanges, signal} from '@angular/core';
import {MovieService} from "../movie.service";
import {StorageService} from "../storage.service";
import {ListComponent} from "../list/list.component";
import {PaginationComponent} from "../pagination/pagination.component";
import {RouterService} from "../router.service";
import {BodyContainerComponent} from "../body-container/body-container.component";
import {Router} from "@angular/router";
import {LanguageCode, PAGE_NOT_FOUND, SEARCH_PAGE} from "../constants";

@Component({
    selector: 'app-search-list',
    imports: [
        ListComponent,
        PaginationComponent,
        BodyContainerComponent
    ],
    template: `
            @if (query().length < 3) {
                <div>search something</div>
            } @else if (results) {
                @if (results.length > 0) {
                    <app-list [language]="language()" [movies]="results" />
                } @else {
                    <div>nothing found</div>
                }
            } @else {
                <div>spinner</div>
            }
        @if (results && results.length > 0 && totalPages && totalPages > 1) {
            <app-pagination [maxPage]="totalPages" [activePage]="page()" [pageNavigation]="pageNavigation"/>
        }
    `,
    styles: ``
})
export class SearchListComponent implements OnChanges {
    movieService = inject(MovieService);
    routerService = inject(RouterService);
    results!: any[];
    totalPages!: number;

    language = input.required<LanguageCode>();
    query = input.required({transform: (value: string) => value ?? ""});
    page = input(1, {transform: (value: string) => Number(value)});

    pageNavigation = (page: number) => {
        this.routerService.navigate([], {queryParams: {query: this.query(), page}});
    };

    ngOnChanges(): void {
        console.log(this.language());
        const query = this.query();
        if (query && query.length > 2) {
            const language = this.language()
            const page = this.page();
            this.movieService.searchMovie(query, {language, page}).subscribe(response => {
                this.results = response["results"];
                this.totalPages = response["totalPages"];
            });
        }
    }
}
