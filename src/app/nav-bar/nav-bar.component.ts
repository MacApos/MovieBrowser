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
            <nav class="navbar bg-body-tertiary rounded-top-3 z-2 w-100 p-2">
                <div class="">
                    <a class="position-relative" href="#">
                        <img src="/img/logo.svg" alt="Logo" height="{{ height }}" class="position-absolute scale"
                             [ngStyle]="style" id="logo"/>
                    </a>
                </div>
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

            <div class="position-absolute z-1 top-0 h-100" id="category-dropdown">
                <div id="category-dropdown-4-col">
                    <div class="category-dropdown-grid" [attr.data-index]="1">
                        <ng-container [ngTemplateOutlet]="button" [ngTemplateOutletContext]="{category}"
                                      *ngFor="let category of movieCategory"/>
                    </div>
                </div>

                <div id="category-dropdown-2-col">
                    <div class="category-dropdown-grid" [attr.data-index]="i+1"
                         *ngFor="let row of [0, middleIndex]; index as i;">
                        <ng-container [ngTemplateOutlet]="button" [ngTemplateOutletContext]="{category}"
                                      *ngFor="let category of movieCategory.slice(row, row + middleIndex); index as i;"/>
                    </div>
                </div>

                <div id="category-dropdown-1-col">
                    <div class="category-dropdown-grid" [attr.data-index]="i+1"
                         *ngFor="let category of movieCategory; index as i">
                        <ng-container [ngTemplateOutlet]="button" [ngTemplateOutletContext]="{category}"/>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class NavBarComponent {
    height = 140;
    style = {top: `-${this.height / 2}px`};

    movieService = inject(MovieService);
    movieCategory = Object.values(this.movieService.movieCategory);
    middleIndex = this.movieCategory.length / 2;
}
