import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryPath, MovieService} from "../movie.service";
import {StorageService} from "../storage.service";
import {ListComponent} from "../list/list.component";

@Component({
    selector: 'app-movie-list',
    imports: [CommonModule, ListComponent],
    template: `
        <app-list [display]="display" [movies]="movieList"/>
    `,
})
export class MovieListComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    movieService = inject(MovieService);
    storageService = inject(StorageService);
    display = "movie-grid";
    movieList!: any[];

    constructor() {
        effect(async () => {
            const path = this.router.parseUrl(this.router.url)
                .root.children["primary"].segments[0].path;
            this.movieList = await this.movieService.getAllMovies(path as CategoryPath, {
                language: this.storageService.storageSignal().language,
                page: this.storageService.stateSignal().page,
                sort_by: "popularity.desc"
            });
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(u => {
            this.storageService.updateState("page", u["page"]);
        });
        console.log("init");
        this.storageService.updateState("pageNavigationFn"
            , (page: number) => {
                return {
                    commands: ["now-playing", page],
                };
            }
        );
    }
}
