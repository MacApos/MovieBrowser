import {inject, Injectable} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class RouterService {
    router = inject(Router);

    navigate(commands: any[], navigationExtras?: NavigationExtras) {
        this.router.navigate(commands, navigationExtras);
    }

    getUrlSegment(index: number) {
        return this.router.parseUrl(this.router.url).root.children["primary"]?.segments[index]?.path;
    }

}
