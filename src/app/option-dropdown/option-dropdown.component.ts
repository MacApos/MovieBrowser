import {Component, effect, inject, signal} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import { NgStyle } from "@angular/common";
import {RouterService} from "../router.service";
import {CategoryPath, SortCriteria, SortDirection} from "../constants";

@Component({
    selector: 'app-option-dropdown',
    imports: [
        ButtonComponent,
        NgStyle,
    ],
    template: `
        <div class="position-fixed bottom-0 end-0 my-3 z-3" id="option">
            <div class="position-relative d-flex justify-content-center align-items-center" id="option-container"
                 (mouseleave)="overflow=false">
                <app-button-component icon="arrow-left"
                                      [attributes]="{disabled:'disabled', class:'btn-info opacity-100'}"
                                      id="option-arrow"/>
                <div class="position-absolute z-n1 d-flex gap-2 justify-content-start align-items-center"
                     [ngStyle]="{'overflow': overflow ? 'visible' : 'hidden'}" id="option-dropdown">
                    <app-button-component icon="list" [attributes]="{ class:'btn-success'}" id="display"/>
                    <div class="d-flex justify-content-center align-items-end gap-2 position-relative" id="sort"
                         (mouseenter)="overflow=true">
                        <app-button-component icon="funnel-fill" [attributes]="{ class:'btn-success'}"/>
                        <ul class="m-0 position-absolute list-group" id="sort-option">
                            <li class="list-group-item list-group-item-action list-group-item-warning text-center p-2"
                            >
                                {{ criteria() }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class OptionDropdownComponent {
    overflow = false;

    criteriaName: Record<SortCriteria, string> = {
        "popularity": "Popularity",
        "vote_average": "Average vote",
        "primary_release_date": "Release date"
    };

    categorySort: Record<CategoryPath, SortCriteria[]> = {
        "now-playing": ["popularity", "vote_average", "primary_release_date"],
        "popular": ["popularity", "popularity"],
        "top-rated": [],
        "upcoming": ["popularity", "vote_average", "primary_release_date"],
    };

    initialCriteria !: Record<string, Record<string, SortCriteria | SortDirection>>;
    routerService = inject(RouterService);
    criteria =
        signal<Record<string, Record<string, SortCriteria | SortDirection>> | undefined>(this.initialCriteria);

    test = signal<Record<string, Record<string, string>>>({test0: {test1: "test1", test2: "test2"}});

    changeCriteria(option: [string, object]) {
        const name = option[0];
        const sort = option[1];


    }

    constructor() {

        // const reduce1 = this.categorySort[this.routerService.getUrlSegment(0) as CategoryPath]
        //     .reduce((accumulator: Record<string, string | SortCriteria | SortDirection>[], currentValue) => {
        //         accumulator.push({name: this.criteriaName[currentValue], criteria: currentValue, direction: "asc"});
        //         return accumulator;
        //     }, []);
    }


    protected readonly Object = Object;
}
