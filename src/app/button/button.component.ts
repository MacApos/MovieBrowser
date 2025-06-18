import {Component, input, OnInit} from '@angular/core';
import {NgOptimizedImage, NgStyle} from "@angular/common";

@Component({
    selector: 'app-button-component',
    imports: [
        NgOptimizedImage,
        NgOptimizedImage,
        NgStyle
    ],
    template: `
        <button class="btn btn-circle"
                [class]="this.attributes()['class']"
                [ngStyle]="this.attributes()['style']"
                [disabled]="this.attributes()['disabled']"
                (click)="handleClick()">
            @if (fill()) {
                <img ngSrc="/img/{{icon()}}.svg" alt="{{icon()}}" fill/>
            } @else {
                <img ngSrc="/img/{{icon()}}.svg" alt="{{icon()}}"
                     width="{{x > 0 ? x : 48}}" height="{{y > 0 ? y : 48}}"/>
            }
        </button>
    `,
})
export class ButtonComponent implements OnInit {
    icon = input.required<string>();
    fill = input(false);
    dimensions = input([0, 0]);
    action = input<() => void>(() => {});
    attributes = input<{ [key: string]: string | any}>({});
    x!: number;
    y!: number;

    ngOnInit(): void {
        [this.x, this.y] = this.dimensions();
    }

    handleClick() {
        const actionFn = this.action();
        if (actionFn) {
            actionFn();
        }
    }
}
