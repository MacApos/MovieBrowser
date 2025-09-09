import {Component, inject} from '@angular/core';
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {RouterOutlet} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {RouterService} from "../router.service";

@Component({
    selector: 'app-header-layout',
    imports: [
        NavBarComponent,
        RouterOutlet
    ],
    template: `
        <div class="container-lg my-3">
            <div class="rounded-3" id="body">
                <app-nav-bar/>
                <div class="bg-body-tertiary bg-opacity-75 rounded-bottom-3 p-3">
                    <router-outlet/>
                </div>
            </div>
        </div>
    `,
})
export class HeaderLayoutComponent {
    routerService = inject(RouterService);
    translateService = inject(TranslateService);

    constructor() {
        const language = this.routerService.getLanguageSegment();
        this.translateService.setDefaultLang(language);
        this.translateService.use(language);
    }
}
