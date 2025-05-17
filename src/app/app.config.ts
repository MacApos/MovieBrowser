import {ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {LocalStorageService} from "./local-storage.service";
import {WINDOW} from "./window.token";
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAppInitializer(() => {
            const storageService = inject(LocalStorageService);
            storageService.initiateStorage();
        }),
        provideHttpClient(),
        provideRouter(routes),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideClientHydration(withEventReplay())]
};
