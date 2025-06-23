import {Component, inject, input, OnChanges, OnInit} from '@angular/core';
import {MovieService} from "../movie.service";
import {LanguageCode} from "../constants";
import {MovieCardComponent} from "../movie-card/movie-card.component";

@Component({
    selector: 'app-movie',
    imports: [
        MovieCardComponent,
    ],
    template: `
        @if (movie && recommendation) {
            <app-movie-card [language]="language()" [movie]="movie" [recommendation]="recommendation"/>
        } @else {
            <div>spinner</div>
        }
    `,
})
export class MovieDetailsComponent implements OnChanges {
    movieService = inject(MovieService);
    movie!: Record<string, any>;
    recommendation!: any[];

    language = input.required<LanguageCode>();
    movieId = input.required<number>();

    ngOnChanges(): void {
        const moveId = this.movieId();
        const language = this.language();
        this.movieService.getMovieById(moveId, language).subscribe(response => {
            response.slice(0, 2).forEach(details => this.movie = {...this.movie, ...details});
            this.recommendation = response[2];
            console.log(this.recommendation);
        });
    }

}
