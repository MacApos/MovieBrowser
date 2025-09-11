import {Component, inject, input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LanguageCode, MOVIE_DETAILS_PAGE} from "../constants";
import {RouterLink} from "@angular/router";
import {MovieService} from "../movie.service";
import {RouterService} from "../router.service";

@Component({
    selector: 'app-link-img',
    imports: [
        RouterLink,
    ],
    template: `
        <a [routerLink]="redirect() ?  ['/', language, MOVIE_DETAILS, movieId()] : null">
            <img class="rounded w-100" [alt]="'Poster' + movieId()"
                 [src]="movieService.getImage(posterPath())">
        </a>
    `,
})
export class LinkImgComponent implements OnChanges {
    movieId = input.required<string>();
    posterPath = input.required<string>();
    redirect = input.required<boolean>();

    movieService = inject(MovieService);
    routerService = inject(RouterService);

    language!: LanguageCode;
    protected readonly MOVIE_DETAILS = MOVIE_DETAILS_PAGE;

    ngOnChanges(): void {
        this.language = this.routerService.getLanguageSegment();
    }
}
