import {
    Component, effect,
    inject,
    input, OnChanges,
} from '@angular/core';
import {RouterService} from "../router.service";
import {Display, MOVIE_DETAILS_PAGE} from "../constants";
import { TranslateService} from "@ngx-translate/core";
import {RatingComponent} from "../rating/rating.component";
import {MovieGridCardComponent} from "../movie-grid-card/movie-grid-card.component";
import {StorageService} from "../storage.service";
import {MovieListCardComponent} from "../movie-list-card/movie-list-card.component";

@Component({
    selector: 'app-movie-card',
    imports: [
        RatingComponent,
        MovieGridCardComponent,
        MovieListCardComponent,
    ],
    template: `
        @if (displayIsGrid) {
            <app-movie-grid-card [movie]="movie()">
                <app-rating [voteAverage]="movie()['vote_average']" [voteCount]="movie()['vote_count']"/>
            </app-movie-grid-card>
        } @else {
            <app-movie-list-card [movie]="movie()"/>
        }
    `,
})
export class MovieCardComponent implements OnChanges{
    movie = input.required<Record<string, any>>();
    recommendation = input<Record<string, any>[]>([]);

    translateService = inject(TranslateService);
    storageService = inject(StorageService);
    routerService = inject(RouterService);

    language !:string
    displayIsGrid!: boolean;
    showDetails!: boolean;

    constructor() {
        effect(() => {
            this.displayIsGrid = this.storageService.getSignal("display") === Display.grid;
        });
    }

    ngOnChanges(): void {
        this.language = this.translateService.currentLang
        this.showDetails = this.routerService.getUrlSegment(1) === MOVIE_DETAILS_PAGE;
    }
}
