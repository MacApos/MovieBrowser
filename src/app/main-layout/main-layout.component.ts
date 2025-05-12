import { Component } from '@angular/core';
import {OptionDropdownComponent} from "../options-dropdown/option-dropdown.component";
import {PaginationComponent} from "../pagination/pagination.component";
import {HeaderLayoutComponent} from "../header-layout/header-layout.component";

@Component({
  selector: 'app-main-layout',
  imports: [
    OptionDropdownComponent,
    PaginationComponent,
    HeaderLayoutComponent,
  ],
  template: `
      <app-header-layout/>
      <app-pagination/>
      <app-options-dropdown/>
  `,
  styles: ``
})
export class MainLayoutComponent {

}
