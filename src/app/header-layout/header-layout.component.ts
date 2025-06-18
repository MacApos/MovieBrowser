import {Component} from '@angular/core';
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import { RouterOutlet} from "@angular/router";

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
<!--                <div class="d-flex justify-content-start align-items-center overflow-visible gap-1"-->
<!--                     style="padding-left:calc(0px / 2); width: 100px; height: 100px;-->
<!--                     /*opacity: 50%;*/-->
<!--                     background-color: rgba(255, 0, 0, 0.5)">-->
<!--                    <div class="flex-shrink-0"-->
<!--                         style="width: 75px; height: 75px; -->
<!--                         opacity: 50%;-->
<!--                         background-color: rgba(255, 0, 0, 1)">-->
<!--                    </div>-->
<!--                    <div class="flex-shrink-0"-->
<!--                         style="width: 75px; height: 75px; -->
<!--                         /*opacity: 100%;*/-->
<!--                         background-color: rgba(0, 0, 255, 1)">-->
<!--                    </div>-->
<!--                </div>-->
                <div class="bg-body-tertiary bg-opacity-75 rounded-bottom-3 p-3">
                    <router-outlet/>
                </div>
            </div>
        </div>
    `,
})
export class HeaderLayoutComponent{
}
