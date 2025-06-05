import {Component,  effect, inject, input, OnChanges, OnInit} from '@angular/core';

import {StorageService} from "../storage.service";
import {ListComponent} from "../list/list.component";
import {BodyContainerComponent} from "../body-container/body-container.component";
import {PaginationComponent} from "../pagination/pagination.component";
import {OptionDropdownComponent} from "../option-dropdown/option-dropdown.component";
import {RouterService} from "../router.service";
import {MovieService} from "../movie.service";
import {LanguageCode, SortCriterion, SortDirection, SortParam} from "../constants";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-movie-list',
    imports: [BodyContainerComponent, PaginationComponent, OptionDropdownComponent, ListComponent],
    template: `
        <app-body-container>
            <app-list [display]="display" [movies]="results"/>
        </app-body-container>
        @if (results && results.length > 0 && totalPages && totalPages > 1) {
            <app-pagination [maxPage]="totalPages" [activePage]="page()" [pageNavigation]="pageNavigation"/>
        }
        <app-option-dropdown [activeCriterion]="sort_criterion()" [activeDirection]="sort_direction()"/>
    `,
})
export class MovieListComponent implements OnChanges {
    movieService = inject(MovieService);
    routerService = inject(RouterService);
    activatedRoute = inject(ActivatedRoute);

    results!: any[];
    totalPages!: number;
    display = "movie-list";

    language = input.required<LanguageCode>();
    page = input.required({transform: (value:string) => Number(value)});
    sort_criterion = input.required({transform: (value:string) => value as SortCriterion ?? "popularity"});
    sort_direction = input.required({transform: (value:string) => value as SortDirection ?? "desc"});

    pageNavigation = (page: number) => {
        return this.routerService.navigate(["..", page], {
            relativeTo: this.activatedRoute,
            queryParams: this.routerService.getQueryParams(),
        });
    };

    ngOnChanges() {
        const language = this.language();
        const page = this.page();
        const sort_by = `${this.sort_criterion()}.${this.sort_direction()}` as SortParam
        console.log(sort_by);
        const path = this.routerService.getUrlSegment(1);
            this.movieService.getMovies(path, {language, page, sort_by}).subscribe(response => {
                this.results = response["results"];
                this.totalPages = response["totalPages"];
            });
    }

}
