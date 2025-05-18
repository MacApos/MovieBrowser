import {afterNextRender, Component, DoCheck, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MovieService} from "../movie.service";
import {LocalStorageService} from "../local-storage.service";

@Component({
    selector: 'app-movie-list',
    imports: [CommonModule, RouterLink],
    template: `
        <div class="d-grid gap-3" [id]="display">
            <a [routerLink]="['/movie-details', movie.id]" class="card" *ngFor="let movie of movieList">
                <div class="row mx-0 h-100" data-index="1">
                    <div class="col px-0" data-index="1">
                        <img alt="Poster" [src]="movieService.getImage(movie.poster_path)"
                             class="rounded-top object-fit-contain w-100">
                    </div>
                    <div class="col px-0">
                        <div class="card-body d-flex flex-column justify-content-between align-items-start gap-3 p-3">
                            <h3 class="card-title">
                                {{ movie.title }}
                            </h3>
                            <p class="card-text">
                                {{ movie.overview }}
                            </p>
                            <div class="card-footer p-0 m-0 w-100"></div>
                            <div class="d-flex flex-wrap justify-content-between align-items-center w-100" id="rating">
                                @let voteAverage = Math.round(movie.vote_average * 10) / 10;
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
            </a>
        </div>
    `,
})
export class MovieListComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    movieService = inject(MovieService);
    storageService = inject(LocalStorageService);
    display = "movie-list";
    movieList!: any[];

    constructor() {
        effect(async () => {
            this.movieList = await this.movieService.getAllMovies("upcoming", {
                language: this.storageService.storageSignal().language
            });
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(u => {
            this.storageService.updateState("page", u["page"]);
        });
    }

    protected readonly Math = Math;
}
