import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-page-not-found',
    imports: [
        TranslatePipe
    ],
    template: `
        <div class="d-flex flex-column justify-content-center align-items-center text-center">
            <h1 class="display-1 fw-bold mb-3">404!</h1>
            <p class="mb-2" [innerHTML]="'pageNotFound.message' | translate"></p>
            <a href="#" class="btn btn-light rounded-pill">
                {{ 'pageNotFound.goHome' | translate }}
            </a>
        </div>
    `,
})
export class PageNotFoundComponent {
}
