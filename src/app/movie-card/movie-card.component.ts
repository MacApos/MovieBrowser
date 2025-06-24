import {
    afterEveryRender,
    afterNextRender,
    Component,
    HostListener,
    inject,
    input, OnChanges,
    OnInit, signal,
} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {NgClass, NgStyle, NgTemplateOutlet} from "@angular/common";
import {MovieService} from "../movie.service";
import {RouterService} from "../router.service";
import {LanguageCode, MOVIE_DETAILS_PAGE, WindowWidth} from "../constants";
import {WINDOW} from "../window.token";
import {filter} from "rxjs";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-movie-card',
    imports: [
        RouterLink,
        NgTemplateOutlet,
        NgClass,
        NgStyle,
        TranslatePipe,
    ],
    template: `
        <div class="card h-100 gap-3">
            <div class="row h-100 mx-0">
                <div class="col px-0">
                    <ng-template let-movieData="movieData" let-redirect="redirect"
                                 let-className="className" #img>
                        @let id = movieData['id'];
                        <a [routerLink]="redirect ?  ['/', language(), MOVIE_DETAILS, id] : null">
                            <img [class]="className" [alt]="'Poster' + id"
                                 [src]="movieService.getImage(movieData['poster_path'])">
                        </a>
                    </ng-template>

                    <ng-container [ngTemplateOutlet]="img"
                                  [ngTemplateOutletContext]="{
                                  movieData: movie(),
                                  redirect:!showDetails,
                                  className:'rounded w-100'}"/>
                </div>
                <div class="col px-0">
                    <div class="card-body d-flex flex-column justify-content-between align-items-start p-3"
                         [ngClass]="showDetails ? 'gap-2' : 'gap-3'">
                        <div class="d-flex flex-column" id="movie-title">
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
                            <p>{{ "movie.genres" | translate }} : {{ movie()["genres"] }}</p>
                            <p>{{ "movie.cast" | translate }}: {{ movie()["cast"] }}</p>
                            <p>{{ "movie.director" | translate }}: {{ movie()["director"] }}</p>
                            <p>{{ "movie.runtime" | translate }}: {{ movie()["runtime"] }}</p>
                        }
                        <p class="card-text">
                            {{ movie()["overview"] }}
                        </p>
                        <p>
                            {{ movie()["release_date"] }}
                        </p>
                        <div class="d-flex flex-wrap justify-content-between align-items-center w-100"
                             id="rating">
                            @let voteAverage = Math.round(movie()["vote_average"] * 10) / 10;
                            <div class="card-footer w-100"></div>
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

            @if (recommendation().length > 0) {
                <div class="row mx-0 mb-3">
                    <div class="col d-flex flex-column px-2">
                        <h3 class="ps-1">Similar</h3>
                        <div id="recommendationCarousel" class="carousel slide rounded-2 w-100">
                            <div class="carousel-inner h-100" [ngStyle]="{overflow:overflow ? 'visible' : 'hidden'}">
                                @for (recommendation of recommendationArray(); track $index) {
                                    <div class="carousel-item h-100" [ngClass]="{active:$first}">
                                        <div class="d-grid gap-3 position-relative h-100 p-1" [ngStyle]="carouselGrid">
                                            @for (movie of recommendation; track movie["id"]) {
                                                <div class="card scale h-100" #card (mouseenter)="this.overflow = true">
                                                    <ng-container [ngTemplateOutlet]="img" [ngTemplateOutletContext]="{
                                                    movieData: movie,
                                                    redirect:true,
                                                    className:'rounded-top w-100'}"/>
                                                    <div class="card-body p-2">
                                                        <h4 class="card-title">
                                                            {{ movie["title"] }}
                                                        </h4>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <ng-template #carouselControl let-slide="slide">
                                <button [class]="'rounded-start-inherit m-1 carousel-control-' + slide"
                                        data-bs-target="#recommendationCarousel" [attr.data-bs-slide]="slide"
                                        (click)="overflow=false">
                                    <span [className]="'carousel-control-' + slide + '-icon'"></span>
                                </button>
                            </ng-template>
                            <ng-container [ngTemplateOutlet]="carouselControl"
                                          [ngTemplateOutletContext]="{slide:'next'}"/>
                            <ng-container [ngTemplateOutlet]="carouselControl"
                                          [ngTemplateOutletContext]="{slide:'prev'}"/>
                        </div>
                    </div>
                </div>
            }
        </div>
    `,
})
export class MovieCardComponent implements OnChanges{
    language = input.required<LanguageCode>();
    movie = input.required<Record<string, any>>();
    recommendation = input<Record<string, any>[]>([]);
    recommendationArray = signal<Record<string, any>[][]>([]);

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.setRecommendationArray();
    }

    movieService = inject(MovieService);
    routerService = inject(RouterService);
    router = inject(Router);
    window = inject(WINDOW);

    showDetails!: boolean;
    overflow = true;
    carouselRange = 4;

    get carouselGrid() {
        return {
            "grid-template-columns": `repeat(${this.carouselRange}, 1fr)`
        };
    }

    ngOnChanges(): void {
        this.routerService.scrollToTop()
        this.showDetails = this.routerService.getUrlSegment(1) === MOVIE_DETAILS_PAGE;
        this.setRecommendationArray();
    }

    setRecommendationArray() {
        if (!this.window) {
            return;
        }
        const width = this.window.innerWidth;
        if (width >= WindowWidth.xl) {
            this.carouselRange = 4;
        } else if (width >= WindowWidth.md) {
            this.carouselRange = 3;
        } else if (width >= WindowWidth.sm) {
            this.carouselRange = 2;
        } else {
            this.carouselRange = 1;
        }

        const array = [];
        for (let i = 0; i < this.recommendation().length; i += this.carouselRange) {
            array.push(this.recommendation().slice(i, i + this.carouselRange));
        }
        this.recommendationArray.set(array);
    }

    protected readonly Math = Math;
    protected readonly MOVIE_DETAILS = MOVIE_DETAILS_PAGE;
}
