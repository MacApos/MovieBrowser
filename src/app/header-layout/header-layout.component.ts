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
                <div class="bg-body-tertiary bg-opacity-50 rounded-bottom-3 p-3">
                    <router-outlet/>
                </div>
            </div>
        </div>
    `,
})
export class HeaderLayoutComponent{
}
