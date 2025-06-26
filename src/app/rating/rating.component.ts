import {Component, input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-rating',
    imports: [
        TranslatePipe
    ],
    template: `
        <div class="d-flex flex-wrap justify-content-between align-items-center" id="rating">
            <div class="card-footer w-100 mt-2 pt-0 pb-2"></div>
            @if (voteCount()) {
                <p>{{ voteAverage() }}</p>
                <div class="d-flex position-relative">
                    <div id="rating-border" class="position-absolute"></div>
                    <input type="range" min="0" max="100" disabled [value]="voteAverage() * 10"
                           id="rating-input">
                </div>
            } @else {
                <p class="fst-italic">{{ "movie.noVotes" | translate }}</p>
            }
        </div>
    `,
})
export class RatingComponent{
    voteCount = input.required<number>();
    voteAverage = input.required({
        transform: (value: number) => Math.round(value * 10) / 10
    });

}
