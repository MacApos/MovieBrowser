import {Component, DoCheck, HostListener, inject, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgTemplateOutlet} from "@angular/common";
import {WINDOW} from "../window.token";
import {LocalStorageService} from "../local-storage.service";

export enum WindowWidth {
    sm = 576,
    md = 768,
    lg = 992,
    xl = 1200,
    xxl = 1400
}

@Component({
    selector: 'app-pagination',
    template: `
        <div class="d-flex justify-content-center pagination pagination-lg my-3">

            <ng-template #chevron let-d="d" let-action="action" let-disable="disabled" let-width="width">
                <div class="page-item">
                    <div class="page-link p-0 w-100 h-100 d-flex justify-content-center align-items-center"
                         (click)="action()"
                         [ngClass]="{disabled:disable}">
                        <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="width ?? 32" viewBox="0 0 16 16"
                             fill="red">
                            <path fill-rule="evenodd" [attr.d]="d"/>
                        </svg>
                    </div>
                </div>
            </ng-template>

            <ng-container [ngTemplateOutlet]="chevron"
                          [ngTemplateOutletContext]="{
                              width:40,
                              d:'M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0M4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5',
                              disabled:activePage==1,
                              action:handleFirst}"/>

            <ng-container [ngTemplateOutlet]="chevron"
                          [ngTemplateOutletContext]="{
                              d:'M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0',
                              disabled:activePage==1,
                              action:handlePrev}"/>

            <div class="pagination-grid">
                <div class="page-item"
                     *ngFor="let page of pages"
                     (click)="handleClick(page)"
                     [ngClass]="{active:activePage===page}">
                    <a class="page-link">
                        {{ page }}
                    </a>
                </div>
            </div>

            <ng-container [ngTemplateOutlet]="chevron"
                          [ngTemplateOutletContext]="{
                              d:'M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708',
                              disabled:activePage==number,
                              action:handleNext}"/>

            <ng-container [ngTemplateOutlet]="chevron"
                          [ngTemplateOutletContext]="{
                              width:40,
                              d:'M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0M11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5',
                              disabled:activePage==number,
                              action:handleLast}"/>
        </div>
    `,
    imports: [
        NgForOf,
        NgClass,
        NgTemplateOutlet
    ],
    styles: ``
})
export class PaginationComponent implements DoCheck {
    storageService = inject(LocalStorageService);
    win = inject(WINDOW);
    number = 16;
    range = this.getRange(this.win);
    activePage!:number;
    pages !: number[];

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.range = this.getRange(this.win);
    }

    ngDoCheck(): void {
        this.activePage = this.storageService.getItem("page");
        this.pages = this.getPagination(this.range, this.number, this.activePage);
    }

    handleClick = (page: number) => this.storageService.setItem("page", page);
    handlePrev = () => this.handleClick(Math.max(1, this.activePage - 1));
    handleNext = () => this.handleClick(Math.min(this.activePage + 1, this.number));
    handleFirst = () => this.handleClick(1);
    handleLast = () => this.handleClick(this.number);

    getRange(window: Window | null) {
        if (window) {
            const width = window.innerWidth;
            return width < WindowWidth.md ? 1 : width < WindowWidth.lg ? 3 : 5;
        }
        return 1;
    }

    getPagination(range: number, length: number, active: number) {
        const end =  Math.min(Math.ceil(active / range) * range, length);
        const start =  end - range + 1 ;
        return Array.from({length: range}, (_: any, i: number) => start + i);
    }
}

