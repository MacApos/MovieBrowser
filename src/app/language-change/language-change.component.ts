import {Component, effect, inject, input,  OnInit, signal} from '@angular/core';
import {StorageService} from "../storage.service";
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
    language = input.required<string>();
    storageService = inject(StorageService);
    languageDetails!: Record<string, string>;

    ngOnInit(): void {
        this.languageDetails = LanguageDetails[this.language()];
    }

    handleChangeLanguage() {
        const languageCode = this.languageDetails["code"];
        this.storageService.setItem("language", languageCode);
        this.storageService.updateState({language:languageCode})
    }


}
