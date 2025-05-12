import {Route, Routes} from '@angular/router';
import {MainLayoutComponent} from "./main-layout/main-layout.component";
import {HeaderLayoutComponent} from "./header-layout/header-layout.component";
import {MovieService} from "./movie.service";

const movieService = new MovieService();
const movieCategory = movieService.movieCategory;
function redirectParams(path: string, redirectTo = movieCategory.nowPlaying.path,
                        pathMatch = "full"): Record<string, string> {
    return {path, redirectTo, pathMatch};
}

const routesMap = Object.values(movieCategory).map((value): Route => {
    return {
        path:value.path,
        component: MainLayoutComponent,
        children: [
            redirectParams("", "1"),
            {
                path: ":page",
                loadComponent: () => import("./movie-list/movie-list.component")
                    .then(c => c.MovieListComponent)
            }
        ]
    };
});

export const routes: Routes = [
    redirectParams(""),
    ...routesMap,
    {
        path: "movie-details",
        component: HeaderLayoutComponent,
        children: [
            redirectParams(""),
            {
                path: ":id", loadComponent: () => import("./movie-details/movie-details.component")
                    .then(c => c.MovieDetailsComponent)
            },
        ]
    },
    redirectParams("**"),
];
