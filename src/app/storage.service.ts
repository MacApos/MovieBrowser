import {inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Theme} from "./mode-toggle/mode-toggle.component";
import {EnumLanguageCode, SortParam} from "./constants";


interface StateType {
    [key: string]: string | number;
    language: EnumLanguageCode,
    sort_by: SortParam
}

interface StorageType {
    [key: string]: string | number;
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
    };

    storageGuard: Record<string, (param: string) => boolean> = {
        theme: param => Object.values(Theme).includes(param as Theme),
    };

    stateSignal = signal({});

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
        }
    }

    getItem(keyName: string) {
        const initStorageValue = this.initStorage[keyName];
        if (!this.isBrowser) {
            return initStorageValue;
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
