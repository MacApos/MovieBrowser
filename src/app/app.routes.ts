import {Route, Routes} from '@angular/router';
import {HeaderLayoutComponent} from "./header-layout/header-layout.component";
import {guardFactory, pageGuard, searchGuard} from "./valid-page.guard";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {SharedDataService} from "./shared-data.service";

const sharedDataService = new SharedDataService();
const {startPage, searchPage, movieCategory} = sharedDataService;

function redirectParams(path: string,
                        redirectTo = startPage,
                        pathMatch = "full"): Record<string, string> {
    return {path, redirectTo, pathMatch};
}

const routesMap = Object.values(movieCategory).map((value): Route => {
    return {
        path: value.path,
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
    {
        path: "",
        component: HeaderLayoutComponent,
        children: [
            redirectParams(""),
            ...routesMap,
            {
                path: "movie-details",
                children: [
                    redirectParams("", `/${startPage}`),
                    {
                        path: ":id", loadComponent: () => import("./movie-details/movie-details.component")
                            .then(c => c.MovieDetailsComponent),
                        canActivate: [guardFactory(pageGuard)]
                    },
                ],
            },
            {
                path: searchPage,
                children: [
                    {
                        path: "",
                        loadComponent: () => import("./search-list/search-list.component")
                            .then(c => c.SearchListComponent),
                    },
                ],
                canActivate: [guardFactory(searchGuard)]
            },
        ]
    },
    {
        path: "**",
        component: PageNotFoundComponent
    }


    // redirectParams(""),
    // {
    //     path: "movie-details",
    //     component: HeaderLayoutComponent,
    //     children: [
    //         redirectParams(""),
    //         {
    //             path: ":id", loadComponent: () => import("./movie-details/movie-details.component")
    //                 .then(c => c.MovieDetailsComponent)
    //         },
    //     ]
    // },
    // {
    //     path: searchPage,
    //     component: PaginationLayoutComponent,
    //     children: [
    //         {
    //             path: "",
    //             loadComponent: () => import("./search-list/search-list.component")
    //                 .then(c => c.SearchListComponent),
    //         },
    //     ],
    //     canActivate: [guardFactory(searchGuard)]
    // },
    // {
    //     path: "**",
    //     component: PageNotFoundComponent
    // }

];
