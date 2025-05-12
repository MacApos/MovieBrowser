import {Component, inject} from '@angular/core';
import {ModeToggleComponent} from "../mode-toggle/mode-toggle.component";
import {CommonModule, NgOptimizedImage,} from "@angular/common";
import {LanguageChangeComponent} from "../language-change/language-change.component";
import {CategoryKey, MovieService} from "../movie.service";

@Component({
    selector: 'app-nav-bar',
    imports: [
        ModeToggleComponent,
        NgOptimizedImage,
        LanguageChangeComponent,
        CommonModule
    ],
    template: `
        <div class="position-relative d-flex justify-content-center" id="navbar">
            <nav class="navbar rounded-top-3 bg-body-tertiary z-2 w-100">
                <div class="container-fluid">
                    <div>
                        <a class="position-relative" href="#">
                            <img ngSrc="/img/logo.svg" class="position-absolute top-n-half-logo-height scale" id="logo"
                                 alt="Logo"
                                 width="275" height="140" priority/>
                        </a>
                    </div>
                    <div class="d-flex justify-content-between align-items-center w-50">
                        <app-mode-toggle/>
                        <app-language-change language="english"/>
                        <app-language-change language="polish"/>
                        <form class="w-60">
                            <input class="form-control border-emphasis border-2" type="search" placeholder="Search"
                                   aria-label="Search">
                        </form>
                    </div>
                </div>
            </nav>

            <div class="position-absolute z-1 top-0 h-100" id="category-dropdown">

                <div id="category-dropdown-4-col">
                    <div class="category-dropdown-grid" [attr.data-index]="1">
                        <button class="w-100 btn btn-info rounded-5"
                                *ngFor="let movies of movieCategoryList">{{ movies }}
                        </button>
                    </div>
                </div>

                <div id="category-dropdown-2-col">
                    <div class="category-dropdown-grid" [attr.data-index]="i+1"
                         *ngFor="let row of [0, middleIndex]; index as i;">
                        <button class="w-100 btn btn-info rounded-5"
                                *ngFor="let movies of movieCategoryList.slice(row, row + middleIndex); index as i;">
                            {{ movies }}
                        </button>
                    </div>
                </div>

                <div id="category-dropdown-1-col">
                    <div class="category-dropdown-grid" [attr.data-index]="i+1"
                         *ngFor="let movies of movieCategoryList; index as i">
                        <button class="w-100 btn btn-info rounded-5">
                            {{ movies }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class NavBarComponent {
    movieService = inject(MovieService);
    movieCategory = this.movieService.movieCategory

    movieCategoryList = Object.keys(this.movieCategory).map(key=>
        this.movieCategory[key as CategoryKey].name);
    middleIndex = this.movieCategoryList.length / 2;

}
