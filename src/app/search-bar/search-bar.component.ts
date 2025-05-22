import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {FetchService} from "../fetch.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {searchPage} from "../app.routes";

@Component({
    selector: 'app-search-bar',
    imports: [
        FormsModule
    ],
    template: `
        <form #searchBar="ngForm">
            <input class="form-control border-emphasis border-2" [(ngModel)]="searchInput" name="searchInput"
                   placeholder="Search"
                   (ngModelChange)="searchMovie()"/>
        </form>
    `,
    styles: ``
})
export class SearchBarComponent {
    searchInput!: string;
    router = inject(Router);

    searchMovie() {
        const input = this.searchInput.trim();
        if (input.length > 3) {
            this.router.navigate([searchPage, {q: input}]);
        }
    }

}
