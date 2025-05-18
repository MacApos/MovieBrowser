import {inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Theme} from "./mode-toggle/mode-toggle.component";
import {LanguageCode} from "./language-change/language-change.component";

interface StorageType {
    [key: string]: string | number;

    theme: Theme,
    language: LanguageCode,
}

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    platformId = inject(PLATFORM_ID);
    isBrowser = isPlatformBrowser(this.platformId);
    initStorage: StorageType = {
        theme: Theme.dark,
        language: LanguageCode.english,
    };
    state = {
        page: 1
    };

    initStorageGuard: Record<string, (param: string) => boolean> = {
        theme: param => Object.values(Theme).includes(param as Theme),
        language: param => Object.values(LanguageCode).includes(param as LanguageCode),
        page: param => Number(param) > 0
    };

    storageSignal = signal(this.initStorage);
    stateSignal = signal(this.state);

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

    updateState(keyName: string, keyValue: any) {
        this.stateSignal.update(current => ({...current, [keyName]: keyValue}));
    }

    setItem(keyName: string, keyValue: any): void {
        if (!keyValue || !this.initStorageGuard[keyName](keyValue)) {
            return;
        }
        this.storageSignal.update(current => ({...current, [keyName]: keyValue}));
        if (this.isBrowser) {
            localStorage.setItem(keyName, keyValue);
        }
    }
}
