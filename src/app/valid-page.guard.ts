import {ActivatedRouteSnapshot, CanActivateFn, GuardResult, Router} from '@angular/router';
import {inject} from "@angular/core";
import {RouterService} from "./router.service";
import {LanguageCode, PAGE_NOT_FOUND, START_PAGE} from "./constants";

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
        return router.createUrlTree([PAGE_NOT_FOUND]);
    }
    return true;
};

export const searchGuard: guardFn = (router, route, routerService) => {
    const {query, page} = route.queryParams;
    if (query == undefined || page && (isNaN(page) || page <= 0)) {
        return router.createUrlTree([PAGE_NOT_FOUND]);
    }
    if (query.length < 2) {
        return router.createUrlTree([START_PAGE]);
    }
    return true;
};

export const languageGuard: guardFn = (router, route, routerService) => {
    const {language} = route.params;
    console.log(Object.values(LanguageCode).includes(language));
    if (!Object.values(LanguageCode).includes(language)) {
        return router.createUrlTree([PAGE_NOT_FOUND]);
    }
    return true;
};