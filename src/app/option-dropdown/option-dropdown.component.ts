import {Component} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import {NgForOf, NgStyle} from "@angular/common";

@Component({
    selector: 'app-option-dropdown',
    imports: [
        ButtonComponent,
        NgStyle,
        NgForOf
    ],
    template: `

        <div class="position-fixed bottom-0 end-0 my-3 z-3" id="option">
            <div class="position-relative d-flex justify-content-center align-items-center" id="option-container"
                 (mouseleave)="overflow=false">
                <app-button-component icon="arrow-left"
                                      [attributes]="{disabled:'disabled', class:'btn-info opacity-100'}"
                                      id="option-arrow"/>
                <div class="position-absolute z-n1 d-flex gap-2 justify-content-start align-items-center bg-danger"
                     [ngStyle]="{'overflow': overflow ? 'visible' : 'hidden'}" id="option-dropdown">
                    <app-button-component icon="list" [attributes]="{ class:'btn-success'}" id="display"/>
                    <div class="d-flex justify-content-center align-items-end gap-2 position-relative bg-warning"
                         id="sort" (mouseenter)="overflow=true">
                        <app-button-component icon="funnel-fill" [attributes]="{ class:'btn-success'}"/>
                        <ul class="m-0 position-absolute list-group" id="sort-option">
                            <li class="list-group-item list-group-item-action list-group-item-warning text-center p-2"
                                *ngFor="let item of ['aaa','aaaaaa','aaa','aaaaa']">
                                {{ item }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class OptionDropdownComponent {
    overflow=false
}
