import {Component} from '@angular/core';

@Component({
    selector: 'app-page-not-found',
    imports: [],
    template: `
        <div class="text-theme">
            <div class="d-flex flex-column justify-content-center align-items-center text-center">
                <h1 class="display-1 fw-bold mb-4">404!</h1>
                <p class="mb-2">Oops! Page not found.<br>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <a href="/" class="btn btn-light rounded-pill">
                    Go Home
                </a>
            </div>
        </div>
    `,
})
export class PageNotFoundComponent {

}
