import { Component } from '@angular/core';

@Component({
  selector: 'app-body-container',
  imports: [],
  template: `
    <div class="bg-body-tertiary bg-opacity-50 rounded-bottom-3 p-3">
      <div class="d-flex flex-column align-items-center">
        <ng-content/>
      </div>
    </div>
  `,
  styles: ``
})
export class BodyContainerComponent {

}
