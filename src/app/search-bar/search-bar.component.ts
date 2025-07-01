import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterService} from "../router.service";
import {SEARCH_PAGE} from "../constants";

@Component({
    selector: 'app-search-bar',
    imports: [
        FormsModule,
        TranslatePipe
    ],
    template: `
        <form #searchBar="ngForm">
            <input class="form-control border-emphasis border-2" [(ngModel)]="query" name="query"
                   placeholder="{{ 'searchBar.search' | translate }}" (ngModelChange)="searchMovie()"/>
        </form>
    `,
    styles: ``
})
export class SearchBarComponent implements OnInit {
    router = inject(Router);
    routerService = inject(RouterService);
    route = inject(ActivatedRoute);
    query !: string;


    ngOnInit(): void {
        this.route.queryParams.subscribe(queryParams => this.query = queryParams['query']);
    }

    searchMovie() {
        const query = this.query.trim();
        const language = this.routerService.getLanguageSegment();
        const category = this.routerService.getCategorySegment();
        if (query.length < 3) {
            return;
        }
        this.routerService.navigate(["/", language, SEARCH_PAGE], {
            queryParams: {query},
            replaceUrl: category === SEARCH_PAGE
        });
    }
}
