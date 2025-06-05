import {Component, inject, input, OnChanges, OnInit} from '@angular/core';
import {RouterService} from "../router.service";
import {CategoryPath, SortCriterion, SortDirection} from "../constants";
import {ActivatedRoute} from '@angular/router';
import {ButtonComponent} from "../button/button.component";
import {NgOptimizedImage, NgStyle} from "@angular/common";

@Component({
    selector: 'app-option-dropdown',
    imports: [
        ButtonComponent,
        NgStyle,
        NgOptimizedImage,
    ],
    template: `
        <div class="position-fixed bottom-0 end-0 my-3 z-3" id="option">
            <div class="position-relative d-flex justify-content-center align-items-center"
                 id="option-container"
                 (mouseleave)="overflow=false">
                <app-button-component icon="arrow-up"
                                      [attributes]="{disabled:'disabled', class:'btn-info opacity-100'}"
                                      id="option-arrow"/>
                <div class="position-absolute d-flex justify-content-start align-items-center gap-2 z-n1"
                     [ngStyle]="{'overflow': overflow ? 'visible' : 'hidden'}" id="option-dropdown">
                    <app-button-component icon="list" [attributes]="{ class:'btn-success'}" id="display"/>
                    <div class="position-relative d-flex justify-content-center align-items-end gap-2" id="sort-option"
                         (mouseenter)="overflow=areCriteriaPresent">
                        <app-button-component icon="funnel-fill"
                                              [attributes]="{class:'btn-success', 
                                              disabled:areCriteriaPresent ? '' : 'disabled'}"/>
                        @if (areCriteriaPresent) {
                            <div class="m-0 position-absolute" id="sort-option-container">
                                @for (criterion of sortCriteria; track criterion) {
                                    @let name = sortObj[criterion]["name"];
                                    @let isActive = criterion === activeCriterion();
                                    <button class="btn px-2 w-100 btn-warning" (click)="handleChangeSorting(criterion)"
                                            id="sort-criterion">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                {{ name }}
                                            </div>
                                            @if (criterion === activeCriterion()) {
                                                <span class="d-inline-flex justify-content-center align-items-center 
                                                rounded-circle border border-2 border-black bg-white"
                                                      [ngStyle]="spanStyles">
                                                    <img ngSrc="/img/arrow-up.svg" alt="sort"
                                                         [width]="reducedDimension" [height]="reducedDimension"/>
                                                </span>
                                            }
                                        </div>
                                    </button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class OptionDropdownComponent implements OnInit, OnChanges {
    activeCriterion = input.required<string>();
    activeDirection = input.required<SortDirection>();

    dimension = 36;
    reducedDimension = Math.ceil(36 * 0.75);
    overflow = false;
    rotation = 0;

    routerService = inject(RouterService);
    activatedRoute = inject(ActivatedRoute);
    sortCriteria !: SortCriterion[];
    areCriteriaPresent!: boolean;

    categorySort: Record<CategoryPath, SortCriterion[]> = {
        "now-playing": ["popularity", "vote_average", "primary_release_date"],
        "popular": ["popularity"],
        "top-rated": [],
        "upcoming": ["popularity", "vote_average", "primary_release_date"],
    };

    sortObj: Record<SortCriterion, { name: string }> = {
        "popularity": {
            name: "Popularity",
        },
        "primary_release_date": {
            name: "Release date",
        },
        "vote_average": {
            name: "Average vote",
        },
    };

    ngOnInit(): void {
        this.sortCriteria = this.categorySort[this.routerService.getUrlSegment(1) as CategoryPath];
        this.areCriteriaPresent = this.sortCriteria.length > 0;
    }

    ngOnChanges(): void {
        this.rotation=this.activeDirection() === "desc" ? -180 : 0;
    }

    handleChangeSorting(criterion: string) {
        this.routerService.navigate([], {
            queryParams: {
                sort_criterion: criterion,
                sort_direction: criterion == this.activeCriterion() && this.activeDirection() === "desc" ?
                    "asc" : "desc"
            }, relativeTo: this.activatedRoute
        });
    }

    get spanStyles() {
        return {
            width: `${this.dimension}px`,
            height: `${this.dimension}px`,
            transform: `rotate(${this.rotation}deg)`
        };
    }

}
