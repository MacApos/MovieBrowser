import {Component, inject} from '@angular/core';
import {ModeToggleComponent} from "../mode-toggle/mode-toggle.component";
import {CommonModule} from "@angular/common";
import {LanguageChangeComponent} from "../language-change/language-change.component";
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {CategoryDetails, MOVIE_CATEGORY} from "../constants";
import {RouterService} from "../router.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-nav-bar',
    imports: [
        ModeToggleComponent,
        LanguageChangeComponent,
        CommonModule,
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
                    <app-language-change language="en"/>
                    <app-language-change language="pl"/>
                    <div class="w-60">
                        <app-search-bar/>
                    </div>
                </div>
            </nav>

            <ng-template #button let-category="category">
                <button class="w-100 btn btn-info rounded-5"
                        (click)="handleChangeCategory(category)">
                    {{ category.name }}
                </button>

            </ng-template>

            <div class="position-absolute z-1 top-0 h-100" id="category-dropdown">
                <div id="category-dropdown-container">
                    <div id="category-dropdown-expand-1">
                        @for (category of movieCategory; track category; let i = $index) {
                            <div id="category-dropdown-col" [attr.data-index]="i">
                                <ng-container [ngTemplateOutlet]="button" [ngTemplateOutletContext]="{category}"/>
                            </div>
                        }
                    </div>
                    <div id="category-dropdown-expand-2">
                        @for (row of [0, middleIndex]; track row; let i = $index) {
                            <div id="category-dropdown-col"
                                 [attr.data-index]="i">
                                @for (category of movieCategory.slice(row, row + middleIndex); track category; let i = $index) {
                                    <ng-container [ngTemplateOutlet]="button"
                                                  [ngTemplateOutletContext]="{category}"
                                    />
                                }
                            </div>
                        }
                    </div>
                    <div id="category-dropdown-expand-4">
                        <div id="category-dropdown-col" [attr.data-index]="0">
                            @for (category of movieCategory; track category) {
                                <ng-container [ngTemplateOutlet]="button"
                                              [ngTemplateOutletContext]="{category}"
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class NavBarComponent {
    routerService = inject(RouterService);
    router = inject(Router);

    height = 130;
    style = {top: `-${this.height / 2}px`};
    movieCategory = Object.values(MOVIE_CATEGORY);
    middleIndex = this.movieCategory.length / 2;

    handleChangeCategory(category: CategoryDetails) {
        const language = this.routerService.getUrlSegment(0);
        this.router.navigate(["/", language, category.path, "1"]);
    }
}
