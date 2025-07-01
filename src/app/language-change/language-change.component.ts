import {Component, inject, input, OnInit} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import {LANGUAGE_DETAILS, LanguageCode} from "../constants";
import {RouterService} from "../router.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-language-change',
    imports: [
        ButtonComponent
    ],
    template: `
        <app-button-component [action]="onLanguageChange.bind(this)" [fill]="true"
                              [icon]="languageDetails['icon']"/>
    `,
})
export class LanguageChangeComponent implements OnInit {
    language = input.required<LanguageCode>();

    routerService = inject(RouterService);
    translateService = inject(TranslateService)

    languageDetails!: Record<string, string>;

    ngOnInit(): void {
        this.languageDetails = LANGUAGE_DETAILS[this.language()];
    }

    onLanguageChange() {
        const urlSegments = this.routerService.getUrlSegments();
        const queryParams = this.routerService.getQueryParams();
        urlSegments[0].path = this.language();
        this.translateService.use(this.language())
        this.routerService.navigate(urlSegments.map(s => s.path), {queryParams});
    }

}
