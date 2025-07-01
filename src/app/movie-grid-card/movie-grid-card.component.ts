import {Component, input} from '@angular/core';
import {LinkImgComponent} from "../link-img/link-img.component";

@Component({
    selector: 'app-movie-grid-card',
    imports: [
        LinkImgComponent,
    ],
    template: `
        <div class="card scale flex-column h-100">
            <app-link-img [movieId]="movie()['id']" [posterPath]="movie()['poster_path']" [redirect]="true"/>
            <div class="card-body d-flex flex-column justify-content-between">
                <h4 class="card-title">
                    {{ movie()["title"] }}
                </h4>
                <ng-content/>
            </div>
        </div>
    `,
    styles: ``
})
export class MovieGridCardComponent {
    movie = input.required<Record<string, any>>();
}
