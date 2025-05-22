import {Component} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import {NgClass, NgStyle} from "@angular/common";

@Component({
    selector: 'app-options-dropdown',
    imports: [
        ButtonComponent,
        NgClass,
        NgStyle
    ],
    template: `
        <div class="position-fixed bottom-0 end-0 py-2 z-3" id="option">
            <div class="position-relative d-flex justify-content-center align-items-center" id="option-container">
                <app-button-component icon="arrow-left"
                                      [attributes]="{disabled:'disabled', class:'btn-info opacity-100'}"
                                      id="option-arrow"/>
                <div class="position-absolute z-n1 d-flex gap-2 justify-content-start align-items-center bg-danger"
                     [ngStyle]="{'overflow': overflow ? 'visible' : 'hidden'}" id="option-dropdown">
                    <app-button-component icon="list" [attributes]="{ class:'btn-success'}" id="display"/>
                    <div class="d-flex justify-content-center align-items-end gap-2 position-relative bg-info" id="sort"
                         (mouseenter)="overflow=true" (mouseleave)="overflow=false">
                        <app-button-component icon="funnel-fill" [attributes]="{ class:'btn-success'}"/>
                        <ul class="m-0 bg-warning end-100 position-absolute">
                            <li>sort1</li>
                            <li>sort2</li>
                            <li>sort2</li>
                            <li>sort2</li>
                        </ul>
                    </div>
                    <!--                    <div class="d-flex bg-info position-absolute top-0 end-0" id="sort">-->
                    <!--                        <ul class="m-0 bg-warning " >-->
                    <!--                            <li>sort1</li>-->
                    <!--                            <li>sort2</li>-->
                    <!--                        </ul>-->
                    <!--                        <app-button-component icon="funnel-fill" [attributes]="{ class:'btn-success'}"/>-->
                    <!--                    </div>-->
                </div>
            </div>
        </div>
    `,
})
export class OptionDropdownComponent {
    overflow=false
}
