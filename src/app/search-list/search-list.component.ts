import {Component, effect, inject, input, Input, OnChanges, signal} from '@angular/core';
import {MovieService} from "../movie.service";
import {StorageService} from "../storage.service";
import {ListComponent} from "../list/list.component";
import {PaginationComponent} from "../pagination/pagination.component";
import {RouterService} from "../router.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {HttpEventType} from "@angular/common/http";
import {BodyContainerComponent} from "../body-container/body-container.component";
import {Router} from "@angular/router";
import {LanguageCode} from "../language-change/language-change.component";

@Component({
    selector: 'app-search-list',
    imports: [
        ListComponent,
        PaginationComponent,
        AsyncPipe,
        BodyContainerComponent
    ],
    template: `
        <app-body-container>
            @if (query.length < 3) {
                <div>search something</div>
            } @else if (results) {
                @if (results.length > 0) {
                    <app-list [movies]="results"/>
                } @else {
                    <div>nothing found</div>
                }
            } @else {
                <div>spinner</div>
            }

        </app-body-container>
        @if (results && results.length > 0 && totalPages && totalPages > 1) {
            <app-pagination [maxPage]="totalPages" [activePage]="page" [pageNavigation]="pageNavigation"/>
        }
    `,
    styles: ``
})
export class SearchListComponent implements OnChanges {
    movieService = inject(MovieService);
    storageService = inject(StorageService);
    routerService = inject(RouterService);
    router = inject(Router);
    results!: any[];
    totalPages!: number;
    querySignal = signal("");

    @Input('query') query!: string;
    @Input({transform: (value: string) => Number(value)}) page!: number;

    pageNavigation = (page: number) => {
        this.routerService.navigate([this.routerService.searchPage], {queryParams: {query: this.query, page}});
    };

    constructor() {
        effect(() => {
            const query = this.querySignal();
            const page = this.page;
            const {language} = this.storageService.stateSignal();
            this.movieService.searchMovie(query, {language, page}).subscribe(response => {
                this.results = response["results"];
                this.totalPages = response["totalPages"];
            });
        });
    }

    ngOnChanges(): void {
        const query = this.query;
        if (query.length > 2) {
            this.querySignal.set(query)
        }
    }
}
