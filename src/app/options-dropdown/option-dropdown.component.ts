import {Component} from '@angular/core';
import {ButtonComponent} from "../button/button.component";

@Component({
    selector: 'app-options-dropdown',
    imports: [
        ButtonComponent
    ],
    template: `
        <div class="position-fixed bottom-0 end-0 py-2 z-3" id="option">
            <div class="position-relative d-flex justify-content-center align-items-center" id="option-dropdown">
                <app-button-component icon="arrow-left"
                                      [attributes]="{disabled:'disabled', class:'btn-info opacity-100'}"
                                      id="option-arrow"/>
                <div class="position-absolute z-n1 d-flex gap-2 justify-content-start
                align-items-center overflow-hidden" id="option-container">
                    <app-button-component icon="list" [attributes]="{ class:'btn-success'}"/>
                    <app-button-component icon="funnel-fill" [attributes]="{ class:'btn-success'}"/>
                </div>
            </div>
        </div>
    `,
})
export class OptionDropdownComponent {

}
