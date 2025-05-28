import {Component, inject} from '@angular/core';
import {ModeToggleComponent} from "../mode-toggle/mode-toggle.component";
import {CommonModule, NgOptimizedImage,} from "@angular/common";
import {LanguageChangeComponent} from "../language-change/language-change.component";
import {MovieService} from "../movie.service";
import {RouterLink} from "@angular/router";
import {SearchBarComponent} from "../search-bar/search-bar.component";

@Component({
    selector: 'app-nav-bar',
    imports: [
        ModeToggleComponent,
        LanguageChangeComponent,
        CommonModule,
        RouterLink,
        SearchBarComponent
    ],
    template: `
        <div class="position-relative d-flex justify-content-start" id="navbar">
            <nav class="navbar bg-body-tertiary rounded-top-3 z-2 p-2">
                <a class="position-relative" href="#">
                    <img src="/img/logo.svg" alt="Logo" height="{{ height }}" class="position-absolute scale"
                         [ngStyle]="style" id="logo"/>
                </a>
                <div class="d-flex justify-content-between align-items-center w-50">
                    <app-mode-toggle/>
                    <app-language-change language="english"/>
                    <app-language-change language="polish"/>
                    <div class="w-60">
                        <app-search-bar/>
                    </div>
                </div>
            </nav>

            <ng-template #button let-category="category">
                <button [routerLink]="['/', category.path, 1]" class="w-100 btn btn-info rounded-5">
                    {{ category.name }}
                </button>
            </ng-template>

            <div class="position-absolute z-1 top-0 h-100" id="cat-dropdown">
                <div id="cat-dropdown-container">
                    <div id="cat-dropdown-expand-1">
                        <div id="cat-dropdown-col" [attr.data-index]="i"
                             *ngFor="let category of movieCategory; index as i">
                            <ng-container [ngTemplateOutlet]="button" [ngTemplateOutletContext]="{category}"/>
                        </div>
                    </div>
                    <div id="cat-dropdown-expand-2">
                        <div id="cat-dropdown-col" *ngFor="let row of [0, middleIndex]; index as i;"
                             [attr.data-index]="i">
                            <ng-container [ngTemplateOutlet]="button"
                                          [ngTemplateOutletContext]="{category}"
                                          *ngFor="let category of movieCategory.slice(row, row + middleIndex);
                                           index as i;"/>
                        </div>
                    </div>
                    <div id="cat-dropdown-expand-4">
                        <div id="cat-dropdown-col" [attr.data-index]="0">
                            <ng-container [ngTemplateOutlet]="button"
                                          [ngTemplateOutletContext]="{category}"
                                          *ngFor="let category of movieCategory"/>
                        </div>
                    </div>
                </div>
            </div>
            <!--                    <div class="position-absolute z-3 top-0 h-100" id="category-dropdown">-->
            <!--                <div id="category-dropdown-4-col">-->
            <!--                    <div class="category-dropdown-grid" [attr.data-index]="1">-->
            <!--                        <ng-container [ngTemplateOutlet]="button" [ngTemplateOutletContext]="{category}"-->
            <!--                                      *ngFor="let category of movieCategory"/>-->
            <!--                    </div>-->
            <!--                </div>-->

            <!--                <div id="category-dropdown-2-col">-->
            <!--                    <div class="category-dropdown-grid" [attr.data-index]="i+1"-->
            <!--                         *ngFor="let row of [0, middleIndex]; index as i;">-->
            <!--                        <ng-container [ngTemplateOutlet]="button" [ngTemplateOutletContext]="{category}"-->
            <!--                                      *ngFor="let category of movieCategory.slice(row, row + middleIndex); index as i;"/>-->
            <!--                    </div>-->
            <!--                </div>-->

            <!--                <div id="category-dropdown-1-col">-->
            <!--                    <div class="category-dropdown-grid" [attr.data-index]="i+1"-->
            <!--                         *ngFor="let category of movieCategory; index as i">-->
            <!--                        <ng-container [ngTemplateOutlet]="button" [ngTemplateOutletContext]="{category}"/>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->
        </div>
    `,
})
export class NavBarComponent {
    height = 130;
    style = {top: `-${this.height / 2}px`};

    movieService = inject(MovieService);
    movieCategory = Object.values(this.movieService.movieCategory);
    middleIndex = this.movieCategory.length / 2;
}
