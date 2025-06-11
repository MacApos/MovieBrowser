import {Component, inject,  input, OnChanges, } from '@angular/core';

import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {filter} from "rxjs";
import {LanguageCode} from "../constants";
import {MovieCardComponent} from "../movie-card/movie-card.component";

@Component({
    selector: 'app-list',
    imports: [
        MovieCardComponent
    ],
    template: `
        <div class="d-grid gap-3" [id]="display()">
            @for (movie of movies(); track movie["id"]) {
                <app-movie-card [language]="language()" [movie]="movie"/>
            }
        </div>
    `,
})
export class ListComponent implements OnChanges {
    display = input("movie-list");
    movies = input.required<Record<string, any>[]>();
    language = input.required<LanguageCode>();
    router = inject(Router);

    ngOnChanges(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                if (window) {
                    window.scrollTo({top: 0, behavior: "smooth"});
                }
            });
    }

}
