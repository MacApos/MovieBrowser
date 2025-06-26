import {
    Component,
    HostListener,
    inject,
    input,
    OnChanges,
    signal,
} from '@angular/core';
import {NgClass, NgStyle, NgTemplateOutlet} from "@angular/common";
import {WindowWidth} from "../constants";
import {WINDOW} from "../window.token";
import {MovieGridCardComponent} from "../movie-grid-card/movie-grid-card.component";

@Component({
    selector: 'app-recommendation',
    imports: [
        NgTemplateOutlet,
        NgStyle,
        NgClass,
        MovieGridCardComponent
    ],
    template: `
        <div class="row mx-0 mb-3">
            <div class="col d-flex flex-column px-2">
                <h3 class="ps-1">Similar</h3>
                <div id="recommendationCarousel" class="carousel slide rounded-2 w-100">
                    <div class="carousel-inner h-100" [ngStyle]="{overflow:overflow ? 'visible' : 'hidden'}"
                         (transitionstart)="transitionEnded=false" (transitionend)="transitionEnded=true">
                        @for (recommendation of recommendationArray(); track $index) {
                            <div class="carousel-item h-100" [ngClass]="{active:$first}"
                            >
                                <div class="d-grid gap-3 position-relative h-100 p-1" [ngStyle]="carouselGrid">
                                    @for (movie of recommendation; track movie["id"]) {
                                        <app-movie-grid-card [movie]="movie"
                                                             (mouseenter)="overflow=transitionEnded"
                                                             (transitionstart)="onTransitionStart($event)"/>
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
    `,
    styles: ``
})
export class RecommendationComponent implements OnChanges {
    recommendation = input.required<Record<string, any>[]>();

    recommendationArray = signal<Record<string, any>[][]>([]);
    window = inject(WINDOW);

    overflow = true;
    transitionEnded = true;
    carouselRange = 4;

    ngOnChanges(): void {
        this.setRecommendationArray();
    }

    get carouselGrid() {
        return {
            "grid-template-columns": `repeat(${this.carouselRange}, 1fr)`
        };
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.setRecommendationArray();
    }

    onTransitionStart($event: TransitionEvent) {
        $event.stopPropagation();
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

}
