import {afterEveryRender, Component, inject, signal} from '@angular/core';
import {ModeToggleComponent} from "../mode-toggle/mode-toggle.component";
import {CommonModule} from "@angular/common";
import {LanguageChangeComponent} from "../language-change/language-change.component";
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {CategoryDetails, CategoryPath, MOVIE_CATEGORY} from "../constants";
import {RouterService} from "../router.service";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-nav-bar',
    imports: [
        ModeToggleComponent,
        LanguageChangeComponent,
        CommonModule,
        SearchBarComponent,
        TranslatePipe
    ],
    template: `
        <div class="position-relative d-flex justify-content-center" id="navbar-container">
            <nav class="navbar bg-body-tertiary rounded-top-3 z-2 p-2">
                <a href="#">
                    <img src="/img/logo.svg" alt="Logo" class="scale" height="130"/>
                </a>
                <div id="navbar-elements" class="d-flex">
                    <div class="d-flex justify-content-between align-items-center gap-2" id="navbar-option">
                        <app-mode-toggle/>
                        <app-language-change language="en"/>
                        <app-language-change language="pl"/>
                    </div>
                    <app-search-bar id="search-bar"/>
                </div>
            </nav>

            <ng-template #button let-category="category">
                <button class="btn rounded-pill w-100 category-button"
                        [ngClass]="{
                        'btn-info':category.path !== activeCategory(),
                        'btn-warning':category.path === activeCategory()}"
                        (click)="onCategoryChange(category)">
                    {{ "categoryPath." + category.path | translate }}
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
    activeCategory = signal<CategoryPath>("now-playing");
    routerService = inject(RouterService);

    movieCategory = Object.values(MOVIE_CATEGORY);
    middleIndex = this.movieCategory.length / 2;

    constructor() {
        afterEveryRender(() => {
            this.activeCategory.set(this.routerService.getCategorySegment() as CategoryPath);
        });
    }

    onCategoryChange(category: CategoryDetails) {
        const language = this.routerService.getLanguageSegment();
        this.routerService.navigate(["/", language, category.path, "1"]);
    }

}
