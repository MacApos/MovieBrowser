import {Component, DoCheck, HostListener, inject, input} from '@angular/core';
import {NgClass, NgTemplateOutlet} from "@angular/common";
import {WINDOW} from "../window.token";
import {WindowWidth} from "../constants";
import {RouterService} from "../router.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-pagination',
    template: `
        @if (window) {
            <div class="position-absolute start-0 w-100 mt-3 p-3">
                <div class="d-flex justify-content-center align-items-center pagination pagination-lg" id="pagination">
                    <ng-template #chevron let-d="d" let-action="action" let-disable="disabled" let-width="width">
                        <div class="page-item">
                            <div class="page-link p-0 w-100 h-100 d-flex justify-content-center align-items-center"
                                 (click)="action()"
                                 [ngClass]="{disabled:disable}">
                                <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="width ?? 32" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" [attr.d]="d"/>
                                </svg>
                            </div>
                        </div>
                    </ng-template>

                    <ng-container [ngTemplateOutlet]="chevron"
                                  [ngTemplateOutletContext]="{
                              width:40,
                              d:'M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0M4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5',
                              disabled:activePage()==1,
                              action:onFirst}"/>

                    <ng-container [ngTemplateOutlet]="chevron"
                                  [ngTemplateOutletContext]="{
                              d:'M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0',
                              disabled:activePage()==1,
                              action:onPrev}"/>

                    <div id="pagination-center" class="d-flex text-center">
                        @for (page of pagination; track page) {
                            <div class="page-item" (click)="onClick(page)" [ngClass]="{active:page===activePage()}">
                                <a class="page-link">
                                    {{ page }}
                                </a>
                            </div>
                        }
                    </div>

                    <ng-container [ngTemplateOutlet]="chevron"
                                  [ngTemplateOutletContext]="{
                              d:'M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708',
                              disabled:activePage()==maxPage(),
                              action:onNext}"/>

                    <ng-container [ngTemplateOutlet]="chevron"
                                  [ngTemplateOutletContext]="{
                              width:40,
                              d:'M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0M11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5',
                              disabled:activePage()==maxPage(),
                              action:onLast}"/>
                </div>

            </div>
        }`,
    imports: [
        NgClass,
        NgTemplateOutlet
    ],
})
export class PaginationComponent implements DoCheck {
    window = inject(WINDOW);

    maxPage = input.required<number>();
    activePage = input.required<number>();
    range!: number;
    pagination!: number[];
    routerService = inject(RouterService);
    activatedRoute = inject(ActivatedRoute);


    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.setRange(this.window, this.maxPage());
    }

    ngDoCheck() {
        this.setRange(this.window, this.maxPage());
        this.setPagination(this.range, this.maxPage(), this.activePage());
    }

    onClick = (page: number) => {
        return this.routerService.navigate(["..", page], {
            relativeTo: this.activatedRoute,
            queryParams: this.routerService.getQueryParams(),
        });
    };

    onPrev = () => this.onClick(Math.max(1, this.activePage() - 1));
    onNext = () => this.onClick(Math.min(this.activePage() + 1, this.maxPage()));
    onFirst = () => this.onClick(1);
    onLast = () => this.onClick(this.maxPage());

    setRange(window: Window | null, length: number) {
        let range = 1;
        if (window) {
            const width = window.innerWidth;
            range = width < WindowWidth.md ? 1 : Math.min(length, width < WindowWidth.lg ? 3 : 5);
        }
        this.range = range;
    }

    setPagination(range: number, length: number, active: number) {
        if (range >= length) {
            this.pagination = Array.from({length}, (_: any, i: number) => i + 1);
            return;
        }
        const start = Math.floor((active - 1) / range) * range;
        this.pagination = Array.from({length: Math.min(length - start, range)}, (_: any, i: number) => start + 1 + i);
    }
}

