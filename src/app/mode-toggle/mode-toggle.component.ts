import {Component, inject} from '@angular/core';
import {StorageService} from "../storage.service";
import {ButtonComponent} from "../button/button.component";
import {Theme} from "../constants";

declare function setTheme(theme: string): void;

@Component({
    selector: 'app-mode-toggle',
    imports: [
        ButtonComponent,
    ],
    template: `
        <app-button-component [action]="onThemeChange.bind(this)" [fill]="true" [icon]="theme"/>
    `,
})
export class ModeToggleComponent {
    storageService = inject(StorageService);
    theme: Theme = this.storageService.getItem("theme");

    onThemeChange() {
        this.theme = this.theme === Theme.dark ? Theme.light : Theme.dark;
        this.storageService.setItem("theme", this.theme);
        setTheme(this.theme);
    }
}
