import {Component, inject, input, OnInit,} from '@angular/core';
import {Display, LanguageCode} from "../constants";
import {RouterService} from "../router.service";
import {MovieGridCardComponent} from "../movie-grid-card/movie-grid-card.component";
import {MovieListCardComponent} from "../movie-list-card/movie-list-card.component";
import {RatingComponent} from "../rating/rating.component";

@Component({
    selector: 'app-list',
    imports: [
        MovieGridCardComponent,
        MovieListCardComponent,
        RatingComponent
    ],
    template: `
        <div class="d-grid gap-3" [id]="'movie-'+display()">
            @for (movie of movies(); track movie["id"]) {
                @if (display() === Display.grid) {
                    <app-movie-grid-card [movie]="movie">
                        <app-rating [voteAverage]="movie['vote_average']" [voteCount]="movie['vote_count']"/>
                    </app-movie-grid-card>
                } @else {
                    <app-movie-list-card [movie]="movie"/>
                }
            }
        </div>
    `,
})
export class ListComponent implements OnInit {
    movies = input.required<Record<string, any>[]>();
    display = input(Display.grid);

    routerService = inject(RouterService);

    language!: LanguageCode;
    protected readonly Display = Display;

    ngOnInit(): void {
        this.language = this.routerService.getLanguageSegment();
        this.routerService.scrollToTop();
    }
}
