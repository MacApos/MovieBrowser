import {Component} from '@angular/core';

@Component({
    selector: 'app-spinner',
    imports: [],
    template: `
      <div class="d-flex justify-content-center">
          <div class="spinner-border text-bg-theme" style="width: 4rem; height: 4rem;">
              <span class="visually-hidden">Loading...</span>
          </div>
      </div>
  `,
    styles: ``
})
export class SpinnerComponent {
}
