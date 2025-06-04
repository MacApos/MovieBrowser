import {CanMatchFn, Router} from '@angular/router';
import {EnumLanguageCode, PAGE_NOT_FOUND} from "./constants";
import {inject} from "@angular/core";

export const matchGuard: CanMatchFn = (_, segments) => {
    if (segments.length < 3) {
        return true;
    }

    const router = inject(Router);
    const language = segments[0].path as EnumLanguageCode;
    const page = Number(segments[2].path);

    if (!Object.values(EnumLanguageCode).includes(language)) {
        router.navigate([PAGE_NOT_FOUND]);
    }

    const number = Number(page);
    if (isNaN(page) || page < 0) {
        router.navigate([PAGE_NOT_FOUND]);
    }

    return true;
};
