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
            @if (movie) {
                <app-movie-card [language]="language()" [movie]="movie"/>
            } @else {
                <div>spinner</div>
            }


            <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="..." class="d-block w-100" alt="...">
                    </div>
                    <div class="carousel-item">
                        <img src="..." class="d-block w-100" alt="...">
                    </div>
                    <div class="carousel-item">
                        <img src="..." class="d-block w-100" alt="...">
                    </div>
                </div>
            </div>


    `,
})
export class MovieDetailsComponent implements OnChanges {
    movieService = inject(MovieService);
    movie!: Record<string, any>;

    language = input.required<LanguageCode>();
    movieId = input.required<number>();

    ngOnChanges(): void {
        const moveId = this.movieId();
        const language = this.language();
        this.movieService.getMovieById(moveId, language).subscribe(response => {
            response.forEach(details=>this.movie = {...this.movie, ...details})
        });
    }

}
