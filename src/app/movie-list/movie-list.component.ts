import {
    afterNextRender,
    Component,
    Directive,
    effect,
    ElementRef,
    inject,
    Input,
    OnChanges,
    ViewChild
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CategoryPath, MovieService} from "../movie.service";
import {StorageService} from "../storage.service";
import {ListComponent} from "../list/list.component";
import {BodyContainerComponent} from "../body-container/body-container.component";
import {PaginationComponent} from "../pagination/pagination.component";
import {OptionDropdownComponent} from "../option-dropdown/option-dropdown.component";
import {RouterService} from "../router.service";
import {bind} from "lodash";

@Directive({selector: 'pane', standalone: true,})
export class Pane {
    @Input() id!: string;
}

@Component({
    selector: 'app-movie-list',
    imports: [CommonModule, ListComponent, BodyContainerComponent, PaginationComponent, OptionDropdownComponent, Pane],
    template: `
        <app-body-container>
<!--            <app-list [display]="display" [movies]="movieList"/>-->
        </app-body-container>
        <app-pagination [maxPage]="15" [activePage]="page" [pageNavigation]="pageNavigation"/>
        <app-option-dropdown/>
    `,
})
export class MovieListComponent implements OnChanges{
    movieService = inject(MovieService);
    storageService = inject(StorageService);
    routerService = inject(RouterService);

    display = "movie-list";
    path = this.routerService.getUrlSegment(0);
    movieList!: any[];

    @Input('page') page!: number;

    pageNavigation = (page: number) => {
        return this.routerService.navigate([this.path, page]);
    };


    constructor() {
        effect(async () => {
            const page = this.page;
            const path = this.path;
            const {language, sort_by} = this.storageService.stateSignal();
            this.movieList = await this.movieService.getAllMovies(path as CategoryPath,
                {language, page, sort_by});
        });
    }

    ngOnChanges(): void {
        this.page = Number(this.page);
    }
}
