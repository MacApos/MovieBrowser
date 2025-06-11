import {Component, inject, input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgTemplateOutlet} from "@angular/common";
import {MovieService} from "../movie.service";
import {RouterService} from "../router.service";
import {LanguageCode, MOVIE_DETAILS} from "../constants";

@Component({
    selector: 'app-movie-card',
    imports: [
        RouterLink,
        NgTemplateOutlet,
        NgClass
    ],
    template: `
        <div class="card">
            <div class="row mx-0 h-100">
                <div class="col px-0">
                    <ng-template #img>
                        <img class="rounded-top object-fit-contain w-100" alt="Poster"
                             [src]="movieService.getImage(movie()['poster_path'])">
                    </ng-template>
                    @if (showDetails) {
                        <ng-container [ngTemplateOutlet]="img"/>
                    } @else {
                        <a [routerLink]="['/', language(), MOVIE_DETAILS, movie()['id']]">
                            <ng-container [ngTemplateOutlet]="img"/>
                        </a>
                    }
                </div>
                <div class="col px-0">
                    <div class="card-body d-flex flex-column justify-content-evenly align-items-start p-3"
                         [ngClass]="showDetails ? 'gap-2' : 'gap-3'">
                        <div class="d-flex flex-column">
                            <h3 class="card-title">
                                {{ movie()["title"] }}
                            </h3>
                            <h4>
                                @if (showDetails && movie()["title"] !== movie()["original_title"]) {
                                    {{ movie()["original_title"] }}
                                }
                            </h4>
                        </div>
                        @if (showDetails) {
                            <p>Cast: {{ movie()["genres"] }}</p>
                            <p>Cast: {{ movie()["cast"] }}</p>
                            <p>Director: {{ movie()["crew"] }}</p>
                            <p>Runtime: {{ movie()["runtime"] }}</p>
                        }
                        <p class="card-text">
                            {{ movie()["overview"] }}
                        </p>
                        <p>
                            {{ movie()["release_date"] }}
                        </p>
                        <div class="card-footer p-0 m-0 w-100"></div>
                        <div class="d-flex flex-wrap justify-content-between align-items-center w-100"
                             id="rating">
                            @let voteAverage = Math.round(movie()["vote_average"] * 10) / 10;
                            <p>{{ voteAverage }}</p>
                            <div class="d-flex position-relative">
                                <div id="rating-border" class="position-absolute"></div>
                                <input type="range" min="0" max="100" disabled [value]="voteAverage * 10"
                                       id="rating-input">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class MovieCardComponent implements OnInit {
    language = input.required<LanguageCode>();
    movie = input.required<Record<string, any>>();

    movieService = inject(MovieService);
    routerService = inject(RouterService);

    showDetails!:boolean;


    ngOnInit(): void {
        this.showDetails = this.routerService.getUrlSegment(1) === MOVIE_DETAILS;
    }

    protected readonly Math = Math;
    protected readonly MOVIE_DETAILS = MOVIE_DETAILS;
}
