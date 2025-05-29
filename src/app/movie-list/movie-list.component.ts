import {Component, computed, Directive, effect, inject, Input, OnChanges} from '@angular/core';
import {CommonModule} from "@angular/common";
import {StorageService} from "../storage.service";
import {ListComponent} from "../list/list.component";
import {BodyContainerComponent} from "../body-container/body-container.component";
import {PaginationComponent} from "../pagination/pagination.component";
import {OptionDropdownComponent} from "../option-dropdown/option-dropdown.component";
import {RouterService} from "../router.service";
import {MovieService} from "../movie.service";

@Directive({selector: 'pane', standalone: true,})
export class Pane {
    @Input() id!: string;
}

@Component({
    selector: 'app-movie-list',
    imports: [CommonModule, BodyContainerComponent, PaginationComponent, OptionDropdownComponent, ListComponent],
    template: `
        <app-body-container>
            <app-list [display]="display" [movies]="results"/>
        </app-body-container>
        @if (results && results.length > 0 && totalPages && totalPages > 1) {
            <app-pagination [maxPage]="totalPages" [activePage]="page" [pageNavigation]="pageNavigation"/>
        }
        <app-option-dropdown/>
    `,
})
export class MovieListComponent {
    movieService = inject(MovieService);
    storageService = inject(StorageService);
    routerService = inject(RouterService);

    display = "movie-list";
    path = this.routerService.getUrlSegment(0);
    results!: any[];
    totalPages!: number;

    @Input({transform: (value: string) => Number(value)}) page!: number;
    state = computed(() => this.storageService.stateSignal());

    pageNavigation = (page: number) => {
        return this.routerService.navigate([this.path, page]);
    };

    constructor() {
        effect(() => {
            const {language, sort_by} = this.storageService.stateSignal();
            const page = this.page;
            this.movieService.getMovies(this.path, {language, page, sort_by}).subscribe(response => {
                this.results = response["results"];
                this.totalPages = response["totalPages"];
            });
        });
    }
}
