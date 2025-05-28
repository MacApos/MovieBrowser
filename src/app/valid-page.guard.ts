import {ActivatedRouteSnapshot, CanActivateFn, GuardResult, Router} from '@angular/router';
import {inject} from "@angular/core";
import {RouterService} from "./router.service";

type guardFn = (router: Router, route: ActivatedRouteSnapshot, movieService: RouterService) => GuardResult

export const guardFactory =
    (guard: guardFn): CanActivateFn =>
        (route: ActivatedRouteSnapshot) => {
            const router = inject(Router);
            const routerService = inject(RouterService);
            return guard(router, route, routerService);
        };

export const pageGuard: guardFn = (router, route, routerService) => {
    const number = route.params["page"] | route.params["id"];
    if (isNaN(number) || number <= 0) {
        return router.createUrlTree([routerService.pageNotFound]);
    }
    return true;
};

export const searchGuard: guardFn = (router, route, routerService) => {
    const {query, page} = route.queryParams;
    if (query==undefined || page && (isNaN(page) || page <= 0)) {
        return router.createUrlTree([routerService.pageNotFound]);
    }
    if (query.length < 2) {
        return router.createUrlTree([routerService.startPage]);
    }
    return true;
};