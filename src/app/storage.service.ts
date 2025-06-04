import {inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Theme} from "./mode-toggle/mode-toggle.component";
import {LanguageCode, SortParam} from "./constants";


interface StateType {
    [key: string]: string | number;

    language: LanguageCode,
    sort_by: SortParam
}

interface StorageType extends StateType {
    theme: Theme,
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
        sort_by: "popularity.desc"
    };

    storageGuard: Record<string, (param: string) => boolean> = {
        theme: param => Object.values(Theme).includes(param as Theme),
        language: param => Object.values(LanguageCode).includes(param as LanguageCode),
    };

    state: StateType = {
        language: this.initStorage.language,
        sort_by: this.initStorage.sort_by,
    };
    stateSignal = signal(this.state);

    updateState(update: object) {
        this.stateSignal.update(current => ({...current, ...update}));
    }


    initiateStorage() {
        if (this.isBrowser) {
            Object.keys(this.initStorage).forEach(keyName => {
                const keyValue = localStorage.getItem(keyName);
                if (keyValue && this.storageGuard[keyName](keyValue)) {
                    this.initStorage[keyName] = keyValue;
                }
            });
            this.stateSignal.set(this.initStorage)
        }
    }

    getItem(keyName: string) {
        const initStorageValue = this.initStorage[keyName];
        if (!this.isBrowser || !initStorageValue) {
            return;
        }
        const keyValue = localStorage.getItem(keyName);
        if (!keyValue || !this.storageGuard[keyName](keyValue)) {
            return initStorageValue;
        }
        try {
            return JSON.parse(keyValue);
        } catch {
            return keyValue;
        }
    }

    setItem(keyName: string, keyValue: any): void {
        if (!keyValue || !this.storageGuard[keyName](keyValue)) {
            return;
        }
        if (this.isBrowser) {
            localStorage.setItem(keyName, keyValue);
        }
    }
}
