import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RouterService} from "../router.service";

@Component({
    selector: 'app-search-bar',
    imports: [
        FormsModule
    ],
    template: `
        <form #searchBar="ngForm">
            <input class="form-control border-emphasis border-2" [(ngModel)]="query" name="query"
                   placeholder="Search" (ngModelChange)="searchMovie()"/>
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
        const path = this.routerService.getUrlSegment(0);
        if (path != this.routerService.searchPage && query.length < 3) {
            return;
        }
        this.routerService.navigate([this.routerService.searchPage], {queryParams: {query, page: 1}});
    }
}
