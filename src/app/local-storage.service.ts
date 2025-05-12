import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Theme} from "./mode-toggle/mode-toggle.component";
import {LanguageCode} from "./language-change/language-change.component";
import { MovieService} from "./movie.service";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    movieService = inject(MovieService);
    platformId = inject(PLATFORM_ID);
    isBrowser = isPlatformBrowser(this.platformId);
    movieCategory = this.movieService.movieCategory;

    initStorage: Record<string, Theme | LanguageCode | string | number> = {
        theme: Theme.dark,
        language: LanguageCode.english,
        category: this.movieCategory.nowPlaying.path,
        page: 1
    };

    initStorageGuard: Record<string, (param: string) => boolean> = {
        theme: param => Object.values(Theme).includes(param as Theme),
        language: param => Object.values(LanguageCode).includes(param as LanguageCode),
        category: param => Object.values(this.movieCategory).some(value =>  value.path == param),
        page: param => Number(param) > 0
    };

    initiateStorage() {
        if (this.isBrowser) {
            Object.keys(this.initStorage).forEach(keyName => {
                const keyValue = localStorage.getItem(keyName);
                if (keyValue && this.initStorageGuard[keyName](keyValue)) {
                    this.initStorage[keyName] = keyValue;
                }
            });
        }
    }

    getItem(keyName: string) {
        const initStorageValue = this.initStorage[keyName] ?? null;
        if (!this.isBrowser) {
            return initStorageValue;
        }
        const keyValue = localStorage.getItem(keyName);
        if (!keyValue || !this.initStorageGuard[keyName](keyValue)) {
            return initStorageValue;
        }
        try {
            return JSON.parse(keyValue);
        } catch {
            return keyValue;
        }
    }

    setItem(keyName: string, keyValue: any): void {
        if (this.isBrowser) {
            localStorage.setItem(keyName, keyValue);
        }
    }

    removeItem(key: string): void {
        if (this.isBrowser) {
            localStorage.removeItem(key);
        }
    }
}
