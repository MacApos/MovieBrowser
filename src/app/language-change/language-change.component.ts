import {Component,  inject, input, OnInit} from '@angular/core';
import {StorageService} from "../storage.service";
import {ButtonComponent} from "../button/button.component";
import {LANGUAGE_DETAILS} from "../constants";

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
        this.languageDetails = LANGUAGE_DETAILS[this.language()];
    }

    handleChangeLanguage() {
        const languageCode = this.languageDetails["code"];
        this.storageService.setItem("language", languageCode);
        this.storageService.updateState({language: languageCode});
    }


}
