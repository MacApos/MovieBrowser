import {CanMatchFn, Router} from '@angular/router';
import {ALL_LANGUAGES, LanguageCode} from "./constants";

export const matchGuard: CanMatchFn = (_, segments) => {
    const language = segments[0].path as LanguageCode;
    if (!ALL_LANGUAGES.includes(language)) {
        return false;
    }

    if (segments.length < 3) {
        return true;
    }

    const page = Number(segments[2].path);
    if (isNaN(page) || page < 0) {
        return false;
    }

    return true;
};