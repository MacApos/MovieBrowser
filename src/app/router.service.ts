import {inject, Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationExtras, Router} from "@angular/router";
import {
    ALL_LANGUAGES,
    CategoryPath, DEFAULT_CATEGORY,
    LanguageCode,
    MOVIE_CATEGORY,
    MOVIE_DETAILS_PAGE,
    SEARCH_PAGE
} from "./constants";
import {filter} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class RouterService {
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    translateService = inject(TranslateService);

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
        return language && ALL_LANGUAGES.includes(language) ? language : this.translateService.getDefaultLang();
    }

    getCategorySegment() {
        let category = this.getUrlSegments()[1].path;
        return category && [...Object.keys(MOVIE_CATEGORY), SEARCH_PAGE, MOVIE_DETAILS_PAGE].includes(category) ?
            category : DEFAULT_CATEGORY;
    }

    getQueryParams() {
        return this.activatedRoute.snapshot.queryParams;
    }

    scrollToTop() {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                if (window) {
                    window.scrollTo({top: 0, behavior: "smooth"});
                }
            });
    }


}
