import {Component, inject, input, InputSignal, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {MovieService} from "../movie.service";
import {filter} from "rxjs";

@Component({
    selector: 'app-list',
    imports: [
        NgForOf,
        RouterLink,
    ],
    template: `
        <div class="d-grid gap-3" [id]="display()">
            <div class="card" *ngFor="let movie of movies()">
                <div class="row mx-0 h-100" data-index="1">
                    <div class="col px-0" data-index="1">
                        <a [routerLink]="['/movie-details', movie['id']]">
                            <img alt="Poster" [src]="movieService.getImage(movie['poster_path'])"
                                 class="rounded-top object-fit-contain w-100">
                        </a>
                    </div>
                    <div class="col px-0">
                        <div class="card-body d-flex flex-column justify-content-between align-items-start gap-3 p-3">
                            <h3 class="card-title">
                                {{ movie["title"] }}
                            </h3>
                            <p class="card-text">
                                {{ movie["overview"] }}
                            </p>
                            <p>
                                {{ movie["release_date"] }}
                            </p>
                            <div class="card-footer p-0 m-0 w-100"></div>
                            <div class="d-flex flex-wrap justify-content-between align-items-center w-100"
                                 id="rating">
                                @let voteAverage = Math.round(movie["vote_average"] * 10) / 10;
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
            </div>
        </div>
    `,
    styles: ``
})
export class ListComponent implements OnInit{
    display = input("movies-list");
    movies: InputSignal<Record<string, any>[]> = input.required();
    movieService = inject(MovieService);
    private readonly router = inject(Router);
    protected readonly Math = Math;

    ngOnInit(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                if (window) {
                    window.scrollTo({top: 0, behavior: "smooth"});
                }
            });
    }
}
