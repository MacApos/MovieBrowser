import {Component, computed, Directive, effect, inject, input, Input, OnChanges} from '@angular/core';
import {CommonModule} from "@angular/common";
import {StorageService} from "../storage.service";
import {ListComponent} from "../list/list.component";
import {BodyContainerComponent} from "../body-container/body-container.component";
import {PaginationComponent} from "../pagination/pagination.component";
import {OptionDropdownComponent} from "../option-dropdown/option-dropdown.component";
import {RouterService} from "../router.service";
import {MovieService} from "../movie.service";
import {LANGUAGE_DETAILS, EnumLanguageCode, LanguageCode} from "../constants";

@Component({
    selector: 'app-movie-list',
    imports: [CommonModule, BodyContainerComponent, PaginationComponent, OptionDropdownComponent, ListComponent],
    template: `
        <app-body-container>
            <app-list [display]="display" [movies]="results"/>
        </app-body-container>
        @if (results && results.length > 0 && totalPages && totalPages > 1) {
            <app-pagination [maxPage]="totalPages" [activePage]="page()" [pageNavigation]="pageNavigation"/>
        }
        <app-option-dropdown/>
    `,
})
export class MovieListComponent implements OnChanges {
    movieService = inject(MovieService);
    storageService = inject(StorageService);
    routerService = inject(RouterService);

    display = "movie-list";
    path = this.routerService.getUrlSegment(1);

    results!: any[];
    totalPages!: number;

    page = input.required<number, string>({transform: (value: string) => Number(value)});
    language = input.required<LanguageCode, string>(
        {transform: (value: string) => value as LanguageCode});

    state = computed(() => this.storageService.stateSignal());

    pageNavigation = (page: number) => {
        return this.routerService.navigate([this.path, page]);
    };

    constructor() {
        effect(() => {
            const {sort_by} = this.storageService.stateSignal();
            const page = this.page();
            const language = this.language();
            this.movieService.getMovies(this.path, {language, page, sort_by}).subscribe(response => {
                this.results = response["results"];
                this.totalPages = response["totalPages"];
            });
        });
    }

    ngOnChanges(): void {
    }


}
