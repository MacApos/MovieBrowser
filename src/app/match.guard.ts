import {CanMatchFn,} from '@angular/router';
import {ALL_LANGUAGES} from "./constants";

export const matchGuard: CanMatchFn = (_, segments) => {
    const language = segments[0].path;
    if (!ALL_LANGUAGES.includes(language)) {
        return false;
    }

    if (segments.length < 3) {
        return true;
    }

    const page = Number(segments[2].path);
    return !(isNaN(page) || page < 0);
};