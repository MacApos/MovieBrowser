import {Component, inject, input, OnInit} from '@angular/core';
import {LocalStorageService} from "../local-storage.service";
import {ButtonComponent} from "../button/button.component";

export enum LanguageCode {
    english = "en-US",
    polish = "pl-PL"
}

export const LanguageDetails: Record<string, Record<string, LanguageCode | string>> = {
    english: {
        code: "en-US",
        path: "usa"
    },
    polish: {
        code: "pl-PL",
        path: "poland"
    }
};

@Component({
    selector: 'app-language-change',
    imports: [
        ButtonComponent
    ],
    template: `
        <app-button-component [action]="handleChangeLanguage.bind(this)" [fill]="true"
                              [icon]="languageDetails['path']"/>
    `,
})
export class LanguageChangeComponent implements OnInit {
    storageService = inject(LocalStorageService);

    language = input.required<string>();
    languageDetails!: Record<string, string>;

    ngOnInit(): void {
        this.languageDetails = LanguageDetails[this.language()];
    }

    handleChangeLanguage() {
        this.storageService.setItem("language", this.languageDetails["code"]);
    }
}
