import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import translationEN from "../../public/i18n/en.json";
import translationPL from "../../public/i18n/pl.json";
import {DEFAULT_LANGUAGE} from "./constants";
import {RouterService} from "./router.service";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    template: `
        <router-outlet/>
    `,
})
export class AppComponent {
    translateService = inject(TranslateService);

    constructor() {
        this.translateService.setTranslation("en", translationEN);
        this.translateService.setTranslation("pl", translationPL);
    }
}
