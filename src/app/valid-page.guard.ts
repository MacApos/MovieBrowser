import {ActivatedRouteSnapshot, CanActivateFn, GuardResult, Router} from '@angular/router';
import {inject} from "@angular/core";
import {pageNotFound, searchPage, startPage} from "./app.routes";

type guardFn = (router: Router, route: ActivatedRouteSnapshot) => GuardResult

export const guardFactory =
    (guard: guardFn): CanActivateFn =>
        (route: ActivatedRouteSnapshot) => {
            const router = inject(Router);
            return guard(router, route);
        };

export const pageGuard: guardFn = (router, route) => {
    const page = route.params["page"];
    console.log(page);
    if (isNaN(page) || page <= 0) {
        return router.createUrlTree([pageNotFound]);
    }
    return true;
};

export const searchGuard = (router: Router, route: ActivatedRouteSnapshot) => {
    const queryParams = route.queryParams;
    const q = queryParams["q"];
    const page = queryParams["page"] ?? "1";
    if (!q || q === "" || page && (isNaN(page) || page <= 0)) {
        return router.createUrlTree([pageNotFound]);
    }
    if (q.length < 2) {
        return router.createUrlTree([startPage]);
    }
    return true;
};