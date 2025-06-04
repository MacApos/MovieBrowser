import {CanMatchFn, Router} from '@angular/router';
import {LanguageCode, PAGE_NOT_FOUND} from "./constants";
import {inject} from "@angular/core";

export const matchGuard: CanMatchFn = (_, segments) => {
    if (segments.length < 3) {
        return true;
    }

    const router = inject(Router);
    const language = segments[0].path as LanguageCode;
    const page = Number(segments[2].path);

    if (!Object.values(LanguageCode).includes(language)) {
        router.navigate([PAGE_NOT_FOUND]);
    }

    const number = Number(page);
    if (isNaN(page) || page < 0) {
        router.navigate([PAGE_NOT_FOUND]);
    }

    return true;
};
