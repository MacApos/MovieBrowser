import {inject, Injectable} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {
    ALL_LANGUAGES,
    CategoryPath, DEFAULT_CATEGORY,
    DEFAULT_LANGUAGE,
    LanguageCode,
    MOVIE_CATEGORY,
    MOVIE_DETAILS_PAGE,
    SEARCH_PAGE
} from "./constants";

@Injectable({
    providedIn: 'root'
})
export class RouterService {
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    navigate(commands: any[], navigationExtras?: NavigationExtras) {
        this.router.navigate(commands, navigationExtras);
    }

    getUrlSegments() {
        return this.router.parseUrl(this.router.url).root.children["primary"]?.segments ?? [];
    }

    getUrlSegment(index: number) {
        return this.getUrlSegments()[index]?.path;
    }

    getLanguageSegment() {
        const language = this.getUrlSegments()[0].path as LanguageCode;
        return language && ALL_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
    }

    getCategorySegment() {
        let category = this.getUrlSegments()[1].path as CategoryPath;
        return category && [...Object.keys(MOVIE_CATEGORY), SEARCH_PAGE, MOVIE_DETAILS_PAGE].includes(category) ?
            category : DEFAULT_CATEGORY;
    }

    getQueryParams() {
        return this.activatedRoute.snapshot.queryParams;
    }

}
