import {Component, inject, input, OnChanges} from '@angular/core';
import {LinkImgComponent} from "../link-img/link-img.component";
import {RatingComponent} from "../rating/rating.component";
import {RecommendationComponent} from "../recommendation/recommendation.component";
import {MOVIE_DETAILS_PAGE} from "../constants";
import {RouterService} from "../router.service";
import {TranslatePipe} from "@ngx-translate/core";
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-movie-list-card',
    imports: [
        LinkImgComponent,
        RatingComponent,
        RecommendationComponent,
        TranslatePipe,
        NgClass
    ],
    template: `
        <div class="card h-100 gap-3">
            <div class="row h-100 mx-0">
                <div class="col px-0">
                    <app-link-img [movieId]="movie()['id']" [posterPath]="movie()['poster_path']"
                                  [redirect]="!showDetails"/>
                </div>
                <div class="col px-0">
                    <div class="card-body d-flex flex-column justify-content-between align-items-start p-3"
                         [ngClass]="showDetails ? 'gap-2' : 'gap-3'">
                        <div class="d-flex flex-column gap-1">
                            <h3 class="card-title">
                                {{ movie()["title"] }}
                            </h3>
                            <h4 class="m-0">
                                @if (showDetails && movie()["title"] !== movie()["original_title"]) {
                                    {{ movie()["original_title"] }}
                                }
                            </h4>
                        </div>
                        @if (showDetails) {
                            @if (movie()["director"]) {
                                <p>{{ "movie.director" | translate }}: {{ movie()["director"] }}</p>
                            }
                            @if (movie()["cast"]) {
                                <p>{{ "movie.cast" | translate }}: {{ movie()["cast"] }}</p>
                            }
                            @if (movie()["production_countries"]) {
                                <p>{{ "movie.production_countries" | translate }}
                                    : {{ movie()["production_countries"] }}</p>
                            }
                            @if (movie()["genres"]) {
                                <p>{{ "movie.genres" | translate }} : {{ movie()["genres"] }}</p>
                            }
                            @if (movie()["runtime"]) {
                                <p>{{ "movie.runtime" | translate }}: {{ movie()["runtime"] }}</p>
                            }
                        }
                        <p class="card-text text-align">
                            {{ movie()["overview"] }}
                        </p>
                        <p>
                            {{ movie()["release_date"] }}
                        </p>
                        <app-rating class="w-100" [voteCount]="movie()['vote_count']"
                                    [voteAverage]="movie()['vote_average']"/>
                    </div>
                </div>
            </div>
            @if (recommendation().length) {
                <app-recommendation [recommendation]="recommendation()"/>
            }
        </div>
    `,
})
export class MovieListCardComponent implements OnChanges {
    movie = input.required<Record<string, any>>();
    recommendation = input<Record<string, any>[]>([]);

    routerService = inject(RouterService);

    showDetails!: boolean;

    ngOnChanges(): void {
        this.showDetails = this.routerService.getUrlSegment(1) === MOVIE_DETAILS_PAGE;
    }

}
