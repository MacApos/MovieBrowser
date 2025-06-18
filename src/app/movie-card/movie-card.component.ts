import {
    afterNextRender,
    Component, computed,
    ElementRef,
    HostListener,
    inject,
    input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgStyle, NgTemplateOutlet} from "@angular/common";
import {MovieService} from "../movie.service";
import {RouterService} from "../router.service";
import {LanguageCode, MOVIE_DETAILS_PAGE} from "../constants";
import {ButtonComponent} from "../button/button.component";

@Component({
    selector: 'app-movie-card',
    imports: [
        RouterLink,
        NgTemplateOutlet,
        NgClass,
        NgStyle,
        ButtonComponent,
    ],
    styles: `
        @keyframes spin {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(calc((250px + 1rem) * -5))
            }
        }

        .carousel-container {
            height: 500px;

            &::before,
            &::after {
                background: linear-gradient(to right, rgba(var(--bs-tertiary-bg-rgb), 0.75) 0%, rgba(var(--bs-tertiary-bg-rgb), 0) 100%);
                content: "";
                height: 100%;
                position: absolute;
                width: 100px;
                z-index: 2;
            }

            &::before {
                left: 0;
                top: 0;
            }

            &::after {
                right: 0;
                top: 0;
                transform: rotateZ(180deg);
            }

            .card img {
                height: 375px
            }

            .carousel-animation {
                /*animation: spin 25s linear infinite;*/
            }
        }
    `,
    template: `
        <div class="card h-100 gap-3">
            <div class="row h-100 mx-0">
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
                <div class="row mx-0 mb-3"
                     (mouseenter)="animationPlayState='paused'"
                     (mouseleave)="animationPlayState='running'">
                    <div class="col px-2">
                        <div class="position-relative overflow-hidden w-100"
                             [ngClass]="{'carousel-container':showCarousel}">
                            <div class="d-flex h-100 gap-2" [style]="carouselStyle">
                                @for (movie of recommendation(); track $index) {
                                    <div class="card bg-danger scale" [ngClass]="{'carousel-animation':showCarousel}"
                                         [ngStyle]="cardStyle">
                                        <img [src]="movieService.getImage(movie['poster_path'])"
                                             [alt]="'poster '+movie['id']" class="rounded-top-2"/>
                                        <div class="card-body p-2">
                                            <h4 class="card-title">
                                                {{ movie["title"] }}
                                            </h4>
                                        </div>
                                    </div>
                                }
                            </div>
                                <button class="carousel-control-prev bg-info">
                                    <span class="carousel-control-prev-icon"></span>
                                </button>
                            <!--                            <button class="carousel-control-next" type="button" data-bs-target="#multiCarousel" data-bs-slide="next">-->
                            <!--                                <span class="carousel-control-next-icon"></span>-->
                            <!--                            </button>-->
                        </div>
                    </div>
                </div>
            }

        </div>
    `,
})
export class MovieCardComponent implements OnInit, OnChanges {
    language = input.required<LanguageCode>();
    movie = input.required<Record<string, any>>();
    recommendation = input<Record<string, any>[]>([]);
    length = computed(() => this.recommendation().length);

    gap = 16;
    cardWidth = 250;
    cardSpace = this.cardWidth + this.gap;
    showCarousel = true;
    animationPlayState: "paused" | "running" = "paused";

    carouselStyle = {
        width: `100%`
    };

    get cardStyle() {
        return {
            'animation-play-state': this.animationPlayState,
            width: `${this.cardWidth}px`,
            flex: `0 0 auto`
        };
    }


    @ViewChild("carouselContainer") private carouselContainer!: ElementRef;

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        // this.setShowCarousel();
    }

    movieService = inject(MovieService);
    routerService = inject(RouterService);

    showDetails!: boolean;

    constructor() {
        afterNextRender(() => {
            if (this.carouselContainer) {
                // this.setShowCarousel();
            }
        });
    }

    ngOnInit(): void {
        this.showDetails = this.routerService.getUrlSegment(1) === MOVIE_DETAILS_PAGE;
        console.log("init");
    }

    setShowCarousel() {
        const width = this.carouselContainer.nativeElement.offsetWidth;
        const length = this.recommendation().length;
        this.showCarousel = length > width / this.cardSpace;
    }

    protected readonly Math = Math;
    protected readonly MOVIE_DETAILS = MOVIE_DETAILS_PAGE;

    ngOnChanges(): void {
    }


    handleMouseEnter() {
        this.animationPlayState = 'paused';
    }

    handleMouseLeave() {
        this.animationPlayState = 'running';
    }

    handleNext() {
    }
}
