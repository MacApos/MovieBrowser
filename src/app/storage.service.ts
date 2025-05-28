import {inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Theme} from "./mode-toggle/mode-toggle.component";
import {LanguageCode} from "./language-change/language-change.component";
import {CategoryPath, SortParam} from "./movie.service";

interface StorageType {
    [key: string]: string | number;

    theme: Theme,
    language: LanguageCode,
}

interface StateType {
    page: number,
    path: CategoryPath,
    sort_by: SortParam
    language: LanguageCode,

}

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    platformId = inject(PLATFORM_ID);
    isBrowser = isPlatformBrowser(this.platformId);
    initStorage: StorageType = {
        theme: Theme.dark,
        language: LanguageCode.english,
    };

    initStorageGuard: Record<string, (param: string) => boolean> = {
        theme: param => Object.values(Theme).includes(param as Theme),
        language: param => Object.values(LanguageCode).includes(param as LanguageCode),
    };

    state: StateType = {
        language: LanguageCode.english,
        sort_by: "popularity.desc",

        page: 1,
        path: "now-playing",
    };
    stateSignal = signal(this.state);

    updateState(update: object) {
        this.stateSignal.update(current => ({...current, ...update}));
    }

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
        if (!keyValue || !this.initStorageGuard[keyName](keyValue)) {
            return;
        }
        if (this.isBrowser) {
            localStorage.setItem(keyName, keyValue);
        }
    }
}
