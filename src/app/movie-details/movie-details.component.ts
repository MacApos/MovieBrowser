import {Component, inject, input, OnChanges} from '@angular/core';
import {MovieService} from "../movie.service";
import {LanguageCode} from "../constants";
import {MovieListCardComponent} from "../movie-list-card/movie-list-card.component";
import {RouterService} from "../router.service";
import {SpinnerComponent} from "../spinner/spinner.component";

@Component({
    selector: 'app-movie',
    imports: [
        MovieListCardComponent,
        SpinnerComponent,
    ],
    template: `
        @if (movie && recommendation) {
            <app-movie-list-card [movie]="movie" [recommendation]="recommendation" id="movie-list"/>
        } @else {
            <app-spinner/>
        }
    `,
})
export class MovieDetailsComponent implements OnChanges {
    movieService = inject(MovieService);
    routerService = inject(RouterService);
    movie!: Record<string, any>;
    recommendation!: any[];

    language = input.required<LanguageCode>();
    movieId = input.required<number>();

    ngOnChanges(): void {
        this.routerService.scrollToTop();
        const moveId = this.movieId();
        const language = this.language();
        this.movieService.getMovieById(moveId, language).subscribe(response => {
            response.slice(0, 2).forEach(details => this.movie = {...this.movie, ...details});
            this.recommendation = response[2];
        });
    }

}
