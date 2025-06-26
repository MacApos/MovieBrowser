import {computed, effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Display, Theme} from "./constants";

interface StorageI {
    [key: string]: string;

    theme: Theme,
}

interface SignalStorageI {
    [key: string]: string;

    display: Display,
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    platformId = inject(PLATFORM_ID);
    isBrowser = isPlatformBrowser(this.platformId);
    initStorage: StorageI = {
        theme: Theme.dark,
    };
    signalStorage = signal<SignalStorageI>({
        display: Display.grid
    });
    computedSignal!: SignalStorageI;

    constructor() {
        effect(() => {
            this.computedSignal = this.signalStorage();
        });
    }


    // get compSignal(){
    //     return this.computedSignal
    // }

    storageGuard: Record<string, (param: string) => boolean> = {
        theme: param => Object.values(Theme).includes(param as Theme),
    };

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

    getSignal(keyName: string) {
        return this.signalStorage()[keyName];
    }

    setSignal(keyName: string, keyValue: Display) {
        if (!Object.keys(this.signalStorage()).includes(keyName)) {
            return;
        }
        this.signalStorage.update(value => {
            return {...value, [keyName]: keyValue};
        });
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
