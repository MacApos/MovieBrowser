import {Component, inject, Input, OnInit} from '@angular/core';
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {ActivatedRoute, RouterOutlet} from "@angular/router";

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
                <router-outlet/>
            </div>
        </div>
    `,
})
export class HeaderLayoutComponent {
}
