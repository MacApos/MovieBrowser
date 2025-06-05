import {Component, inject, input, OnInit} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import {LANGUAGE_DETAILS, EnumLanguageCode, LanguageCode} from "../constants";
import {RouterService} from "../router.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-language-change',
    imports: [
        ButtonComponent
    ],
    template: `
        <app-button-component [action]="handleChangeLanguage.bind(this)" [fill]="true"
                              [icon]="languageDetails['icon']"/>
    `,
})
export class LanguageChangeComponent implements OnInit {
    language = input.required<LanguageCode>();
    routerService = inject(RouterService);
    languageDetails!: Record<string, string>;

    ngOnInit(): void {
        this.languageDetails = LANGUAGE_DETAILS[this.language()];
    }

    handleChangeLanguage() {
        const urlSegments = this.routerService.getUrlSegments();
        const queryParams = this.routerService.getQueryParams();
        urlSegments[0].path = this.language();
        this.routerService.navigate(urlSegments.map(s => s.path), queryParams);
    }


}
