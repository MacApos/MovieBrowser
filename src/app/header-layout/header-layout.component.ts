import {Component, inject} from '@angular/core';
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {DEFAULT_LANGUAGE} from "../constants";
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
export class HeaderLayoutComponent{
    routerService = inject(RouterService);
    translateService = inject(TranslateService);

    constructor() {
        this.translateService.setDefaultLang(this.routerService.getLanguageSegment());
    }
}
