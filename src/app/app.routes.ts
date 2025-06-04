import {Route, Routes} from '@angular/router';
import {HeaderLayoutComponent} from "./header-layout/header-layout.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {START_PAGE, PAGE_NOT_FOUND, SEARCH_PAGE, MOVIE_CATEGORY} from "./constants"
import {matchGuard} from "./match.guard";

function redirectParams(path: string,
                        redirectTo = START_PAGE,
                        pathMatch = "full"): Record<string, string> {
    return {path, redirectTo, pathMatch};
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
                // canActivate: [guardFactory(pageGuard)]
            },
        ]
    };
});

export const routes: Routes = [
    {
        path: PAGE_NOT_FOUND,
        component: PageNotFoundComponent
    },
    {
        path: "",
        component: HeaderLayoutComponent,
        canMatch:[matchGuard],
        children: [
            redirectParams("", START_PAGE),
            {
                path: ":language",
                children: [
                    redirectParams("", `/${START_PAGE}` ),
                    ...routesMap,
                    {
                        path: "movie-details",
                        children: [
                            redirectParams("", `/${PAGE_NOT_FOUND}`),
                            {
                                path: ":id", loadComponent: () =>
                                    import("./movie-details/movie-details.component")
                                    .then(c => c.MovieDetailsComponent),
                            },
                        ],
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
            }
        ]
    },
    {
        path: "**",
        component: PageNotFoundComponent
    }
];


// {
//     path: "",
//     component: HeaderLayoutComponent,
//     children: [
//         redirectParams(""),
//         ...routesMap,
//         {
//             path: "movie-details",
//             children: [
//                 redirectParams("", `/${startPage}`),
//                 {
//                     path: ":id", loadComponent: () => import("./movie-details/movie-details.component")
//                         .then(c => c.MovieDetailsComponent),
//                     canActivate: [guardFactory(pageGuard)]
//                 },
//             ],
//         },
//         {
//             path: searchPage,
//             children: [
//                 {
//                     path: "",
//                     loadComponent: () => import("./search-list/search-list.component")
//                         .then(c => c.SearchListComponent),
//                 },
//             ],
//             canActivate: [guardFactory(searchGuard)]
//         },
//     ]
// },
// {
//     path: "**",
//     component: PageNotFoundComponent
// }

