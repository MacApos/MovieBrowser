import {afterRender, Component, inject, OnInit, output, signal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {StorageService} from "../storage.service";
import {ButtonComponent} from "../button/button.component";


import { Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

declare function setTheme(theme: string): void;

export enum Theme {
    light = "light",
    dark = "dark",
}

@Component({
    selector: 'app-mode-toggle',
    imports: [
        ButtonComponent
    ],
    template: `
        <app-button-component [action]="handleChangeTheme.bind(this)" [fill]="true" [icon]="theme"/>
    `,
})
export class ModeToggleComponent {
    storageService = inject(StorageService);
    theme: Theme = this.storageService.getItem("theme");

    handleChangeTheme() {
        this.theme = this.theme === Theme.dark ? Theme.light : Theme.dark;
        this.storageService.setItem("theme", this.theme);
        setTheme(this.theme);
    }
}
