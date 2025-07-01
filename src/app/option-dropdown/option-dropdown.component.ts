import {Component, effect, inject, input, OnChanges} from '@angular/core';
import {RouterService} from "../router.service";
import {CategoryPath, Display, MOVIE_CATEGORY, SortCriterion, SortDirection} from "../constants";
import {ActivatedRoute} from '@angular/router';
import {ButtonComponent} from "../button/button.component";
import {NgStyle} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {StorageService} from "../storage.service";

@Component({
    selector: 'app-option-dropdown',
    imports: [
        ButtonComponent,
        NgStyle,
        TranslatePipe,
    ],
    template: `
        <div class="position-fixed bottom-0 end-0 mx-2 my-3 z-3" id="option">
            <div class="position-relative d-flex justify-content-center align-items-center"
                 id="option-container"
                 (mouseenter)="onOptionContainerMouseEnter()"
                 (mouseleave)="onOptionContainerMouseLeave()">
                <app-button-component [icon]="'arrow-up'"
                                      [attributes]="{disabled:'disabled', class:'btn-info opacity-100'}"
                                      id="option-arrow"/>
                <div class="position-absolute z-n1 d-flex flex-column justify-content-start align-items-center gap-2 
                w-100 h-0 bottom-50 pt-1"
                     [ngStyle]="optionDropdownStyle" id="option-dropdown">
                    <app-button-component [icon]="display"
                                          [attributes]="{class:'btn-success'}" id="display"
                                          (click)="onDisplayClick()"/>
                    <div class="position-relative d-flex justify-content-center align-items-end gap-2"
                         id="sort-option"
                         (mouseenter)="onSortOptionMouseEnter()"
                         (mouseleave)="onSortOptionMouseLeave()">
                        <app-button-component [icon]="'funnel'"
                                              [attributes]="{
                                              class:'btn-success',
                                              disabled:showCriteria ? '' : 'disabled'}"/>
                        @if (showCriteria) {
                            <div class="position-absolute end-100 bottom-0 d-flex flex-column justify-content-between
                             m-0 overflow-hidden" id="sort-option-container" [ngStyle]="sortOptionContainerStyle"
                                 (transitioncancel)="onTransitionCancel($event)"
                                 (transitionend)="onTransitionEnded($event)">
                                @for (criterion of sortCriteria; track criterion) {
                                    <button class="btn px-2 w-100 btn-warning" id="sort-criterion"
                                            (click)="onSortingChange(criterion)">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                {{ "sortCriterion." + criterion | translate }}
                                            </div>
                                            @if (criterion === activeCriterion()) {
                                                <span class="d-inline-flex justify-content-center align-items-center 
                                                rounded-circle border border-2 border-black bg-white"
                                                      [ngStyle]="spanStyle">
                                                    <img src="/img/arrow-up.svg" alt="sort" class="w-75"/>
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
export class OptionDropdownComponent implements OnChanges {
    activeCriterion = input.required<string>();
    activeDirection = input.required<SortDirection>();

    routerService = inject(RouterService);
    activatedRoute = inject(ActivatedRoute);
    storageService = inject(StorageService);

    display!: Display;
    sortCriteria!: SortCriterion[];
    showCriteria!: boolean;
    spanRotation = 0;
    containerHeight = 64;
    dropdownHeight = 0;
    baseHeight = 68;
    padding = 16;
    overflow = false;
    containerLeft = false;
    transitionEnded = false;

    constructor() {
        effect(() => {
            this.display = this.storageService.getSignal("display") === Display.list ? Display.grid : Display.list;
        });
    }

    ngOnChanges(): void {
        this.sortCriteria = MOVIE_CATEGORY[this.routerService.getCategorySegment() as CategoryPath].sort;
        this.showCriteria = this.sortCriteria.length > 0;
        this.spanRotation = this.activeDirection() === "desc" ? -180 : 0;
    }

    get sortOptionContainerStyle() {
        return {
            height: `${this.containerHeight}px`
        };
    }

    get optionDropdownStyle() {
        return {
            overflow: this.overflow ? 'visible' : 'hidden',
            height: `${this.dropdownHeight}px`
        };
    }

    get spanStyle() {
        return {
            width: '36px',
            height: '36px',
            transform: `rotate(${this.spanRotation}deg)`
        };
    }

    onDisplayClick() {
        this.storageService.setSignal("display", this.display);
    }

    onOptionContainerMouseEnter() {
        this.dropdownHeight = this.baseHeight * 2.5 + this.padding * 2.5;
        this.containerLeft = false;
    }

    onOptionContainerMouseLeave() {
        if (!this.transitionEnded ) {
            this.overflow = false;
            this.dropdownHeight = 0;
        }
        this.containerLeft = true;
    }

    onSortOptionMouseEnter() {
        // at this point sort option has been touched and its container will be hidden only after both transition end
        this.overflow = true;
        this.transitionEnded=false;
        const length = this.sortCriteria.length;
        this.containerHeight = length * 64 + Math.max(0, length - 1) * 12;
    }

    onSortOptionMouseLeave() {
        this.containerHeight = 64;
    }

    onTransitionCancel($event: TransitionEvent) {
        if (!this.transitionEnded && $event.propertyName == "height") {
            this.transitionEnded = true;
        }
    }

    onTransitionEnded($event: TransitionEvent) {
        // at this point first transition ended
        if (!this.transitionEnded && $event.propertyName == "height") {
            this.transitionEnded = true;
        }

        // at this point second transition ended
        if (this.transitionEnded && $event.propertyName === "width") {
            this.transitionEnded = false;
            this.overflow = false;
            if (this.containerLeft) {
                this.dropdownHeight = 0;
            }
        }
    }

    onSortingChange(criterion: string) {
        this.routerService.navigate([], {
            queryParams: {
                sort_criterion: criterion,
                sort_direction: criterion == this.activeCriterion() && this.activeDirection() === "desc" ?
                    "asc" : "desc"
            },
            relativeTo: this.activatedRoute
        });
    }
}
