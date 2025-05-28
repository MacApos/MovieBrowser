import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter,  withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {StorageService} from "./storage.service";
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAppInitializer(() => {
            const storageService = inject(StorageService);
            storageService.initiateStorage();
        }),
        provideHttpClient(),
        provideRouter(routes,
            withComponentInputBinding()),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideClientHydration(withEventReplay())]
};
