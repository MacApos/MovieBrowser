import {inject, InjectionToken, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

export const WINDOW = new InjectionToken<Window | null>("WindowToken", {
    factory: () => {
        const platformId = inject(PLATFORM_ID);
        return isPlatformBrowser(platformId) && window ? window : null ;
    }
});