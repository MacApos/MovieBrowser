import {Route, Routes} from '@angular/router';
import {HeaderLayoutComponent} from "./header-layout/header-layout.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {PAGE_NOT_FOUND, SEARCH_PAGE, MOVIE_CATEGORY, MOVIE_DETAILS_PAGE, START_PAGE, DEFAULT_LANGUAGE} from "./constants";
import {matchGuard} from "./match.guard";

function redirectParams(path: string, redirectTo: string, pathMatch = "full") {
    const route: Record<string, string> = {path, redirectTo, pathMatch};
    return route;
}

const routesMap = Object.values(MOVIE_CATEGORY).map((value): Route => {
    return {
        path: value.path,
        children: [
            redirectParams("", "1"),
            {
                path: ":page",
                loadComponent: () => import("./movie-list/movie-list.component")
                    .then(c => c.MovieListComponent),
            },
        ]
    };
});

export const routes: Routes = [
    {
        path: "",
        component: HeaderLayoutComponent,
        children: [


            redirectParams("", `${DEFAULT_LANGUAGE}/${START_PAGE}`),
            {
                path: ":language",
                canMatch: [matchGuard],
                children: [
                    redirectParams("", START_PAGE),
                    ...routesMap,
                    {
                        path: MOVIE_DETAILS_PAGE,
                        children: [
                            redirectParams("", `/${PAGE_NOT_FOUND}`),
                            {
                                path: ":movieId", loadComponent: () =>
                                    import("./movie-details/movie-details.component")
                                        .then(c => c.MovieDetailsComponent),
                            },
                        ]
                    },
                    {
                        path: SEARCH_PAGE,
                        children: [
                            {
                                path: "",
                                loadComponent: () =>
                                    import("./search-list/search-list.component")
                                        .then(c => c.SearchListComponent),
                            },
                        ],
                    },
                ]
            },
            {
                path: "**",
                component: PageNotFoundComponent
            },
        ]
    },

];