import {Route, Routes} from '@angular/router';
import {MainLayoutComponent} from "./main-layout/main-layout.component";
import {HeaderLayoutComponent} from "./header-layout/header-layout.component";
import { MovieService} from "./movie.service";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {guardFactory, pageGuard, searchGuard} from "./valid-page.guard";
import {SearchListComponent} from "./search-list/search-list.component";

const movieService = new MovieService();
const movieCategory = movieService.movieCategory;

// TODO: find better place for storing this variables
export const startPage = "now-playing/1"
export const pageNotFound = "page-not-found"
export const searchPage = "search"

function redirectParams(path: string,
                        redirectTo = startPage,
                        pathMatch = "full"): Record<string, string> {
    return {path, redirectTo, pathMatch};
}

const routesMap = Object.values(movieCategory).map((value): Route => {
    return {
        path: value.path,
        component: MainLayoutComponent,
        children: [
            redirectParams("", "1"),
            {
                path: ":page",
                loadComponent: () => import("./movie-list/movie-list.component")
                    .then(c => c.MovieListComponent),
                canActivate: [guardFactory(pageGuard)]
            },
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
    {
        path: searchPage,
        component: SearchListComponent,
        // loadComponent: () => import("./movie-details/movie-details.component")
        //     .then(c => c.MovieDetailsComponent)
        canActivate: [guardFactory(searchGuard)]
    },
    {
        path: "test",
        component: SearchListComponent,
    },
    {
        path: "**",
        component: PageNotFoundComponent
    }

];
