import {inject, Injectable} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {SharedDataService} from "./shared-data.service";

@Injectable({
    providedIn: 'root'
})
export class RouterService {
    router = inject(Router);
    routeService = inject(SharedDataService);
    startPage!: string;
    pageNotFound!: string;
    searchPage !: string;

    constructor() {
        ({startPage: this.startPage, pageNotFound: this.pageNotFound, searchPage: this.searchPage} = this.routeService);
    }

    navigate(commands: any[], navigationExtras?: NavigationExtras) {
        this.router.navigate(commands, navigationExtras);
    }

    getUrlSegment(index: number) {
        return this.router.parseUrl(this.router.url).root.children["primary"]?.segments[index]?.path;
    }

}
