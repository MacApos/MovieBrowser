import {inject, Injectable} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";

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

    getQueryParams() {
        return this.activatedRoute.snapshot.queryParams;
    }

}
