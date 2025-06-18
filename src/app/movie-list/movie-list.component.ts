import {Component, inject, input, OnChanges} from '@angular/core';
import {ListComponent} from "../list/list.component";
import {PaginationComponent} from "../pagination/pagination.component";
import {OptionDropdownComponent} from "../option-dropdown/option-dropdown.component";
import {RouterService} from "../router.service";
import {MovieService} from "../movie.service";
import {LanguageCode, SortCriterion, SortDirection, SortParam} from "../constants";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-movie-list',
    imports: [PaginationComponent, OptionDropdownComponent, ListComponent],
    template: `

        @if (results && results.length > 0) {
            <app-list [display]="display" [movies]="results" [language]="language()"/>
            @if (totalPages && totalPages > 1) {
                <app-pagination [maxPage]="totalPages" [activePage]="page()" [pageNavigation]="pageNavigation"/>
            }
            <app-option-dropdown [activeCriterion]="sort_criterion()" [activeDirection]="sort_direction()"/>
        }
    `,
})
export class MovieListComponent implements OnChanges {
    movieService = inject(MovieService);
    routerService = inject(RouterService);
    activatedRoute = inject(ActivatedRoute);

    results!: any[];
    totalPages!: number;
    display = "movie-grid";

    language = input.required<LanguageCode>();
    page = input.required({transform: (value: string) => Number(value)});
    sort_criterion = input.required({transform: (value: string) => value as SortCriterion ?? "popularity"});
    sort_direction = input.required({transform: (value: string) => value as SortDirection ?? "desc"});

    pageNavigation = (page: number) => {
        return this.routerService.navigate(["..", page], {
            relativeTo: this.activatedRoute,
            queryParams: this.routerService.getQueryParams(),
        });
    };

    ngOnChanges(): void {
        const language = this.language();
        const page = this.page();
        const sort_by = `${this.sort_criterion()}.${this.sort_direction()}` as SortParam;
        const category = this.routerService.getCategorySegment();
        this.movieService.getMovies(category, {language, page, sort_by}).subscribe(response => {
            const {results, totalPages} = response;
            this.results = results;
            this.totalPages = totalPages;
        });
    }

}
