import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {StorageService} from "./storage.service";
import {provideHttpClient, withFetch} from "@angular/common/http";
import {provideTranslateService} from "@ngx-translate/core";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAppInitializer(() => {
            const storageService = inject(StorageService);
            storageService.initiateStorage();
        }),
        provideHttpClient(withFetch()),
        provideRouter(routes, withComponentInputBinding()),
        provideTranslateService({
            defaultLanguage: 'en'
        }),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideClientHydration(withEventReplay())]
};
