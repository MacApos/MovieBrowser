import {Component, computed, inject} from '@angular/core';
import {OptionDropdownComponent} from "../options-dropdown/option-dropdown.component";
import {PageNavigationFn, PaginationComponent} from "../pagination/pagination.component";
import {HeaderLayoutComponent} from "../header-layout/header-layout.component";
import {StorageService} from "../storage.service";

@Component({
    selector: 'app-main-layout',
    imports: [
        OptionDropdownComponent,
        PaginationComponent,
        HeaderLayoutComponent,
    ],
    template: `
        <app-header-layout/>
        <app-pagination [pageNavigation]="pageNavigationFn()"/>
        <app-options-dropdown/>
    `,
})
export class MainLayoutComponent {
    storageService = inject(StorageService);
    pageNavigationFn = computed(() => this.storageService.stateSignal().pageNavigationFn);
}
