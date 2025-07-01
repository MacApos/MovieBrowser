import {Component, effect, inject, input, OnChanges} from "@angular/core";
import {PaginationComponent} from "../pagination/pagination.component";
import {OptionDropdownComponent} from "../option-dropdown/option-dropdown.component";
import {ListComponent} from "../list/list.component";
import {CategoryPath, Display, LanguageCode, SortCriterion, SortDirection, SortParam} from "../constants";
import {MovieService} from "../movie.service";
import {RouterService} from "../router.service";
import {StorageService} from "../storage.service";


@Component({
    selector: 'app-movie-list',
    imports: [PaginationComponent, OptionDropdownComponent, ListComponent],
    template: `
        @if (results && results.length) {
            <app-list [movies]="results" [display]="display"/>
            @if (totalPages && totalPages > 1) {
                <app-pagination [maxPage]="totalPages" [activePage]="page()"/>
            }
            <app-option-dropdown [activeCriterion]="sort_criterion()" [activeDirection]="sort_direction()"/>
        }
    `,
})
export class MovieListComponent implements OnChanges {
    language = input.required<LanguageCode>();
    page = input.required({transform: (value: string) => Number(value)});
    sort_criterion = input.required({
        transform: (value: string) => value as SortCriterion ?? "popularity"
    });
    sort_direction = input.required({
        transform: (value: string) => value as SortDirection ?? "desc"
    });

    movieService = inject(MovieService);
    routerService = inject(RouterService);
    storageService = inject(StorageService);

    display!: Display;
    results!: any[];
    totalPages!: number;

    constructor() {
        effect(() => {
            this.display = this.storageService.getSignal("display") as Display;
        });
    }

    ngOnChanges(): void {
        const language = this.language();
        const page = this.page();
        const sort_by = `${this.sort_criterion()}.${this.sort_direction()}` as SortParam;
        const category = this.routerService.getCategorySegment() as CategoryPath;
        this.movieService.getMovies(category, {language, page, sort_by}).subscribe(response => {
            const {results, totalPages} = response;
            this.results = results;
            this.totalPages = category === "upcoming" ? 6 : totalPages;
        });
    }

}
