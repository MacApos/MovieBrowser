import {Injectable} from '@angular/core';
import {LanguageCode} from "./language-change/language-change.component";

export type CategoryPath = "now-playing" | "popular" | "top-rated" | "upcoming"
type SortCriteria = "popularity" | "vote_average" | "primary_release_date";
type SortDirection = "asc" | "desc"
export type SortParam = `${SortCriteria}.${SortDirection}`

export type CategoryDetails = {
    name: string,
    path: CategoryPath,
    params: string,
}

export type QueryParams = {
    language?: LanguageCode,
    sort_by?: SortParam,
    page?: number,
}

@Injectable({
    providedIn: 'root'
})
export class SharedDataService {
    startPage = "now-playing/1";
    pageNotFound = "page-not-found";
    searchPage = "search";

    presentDate = new Date();
    presentFormattedDate = this.formatDate(new Date());
    pastFormattedDate = this.formatDate(new Date(this.presentDate.setDate(this.presentDate.getDate() - 60)));

    movieCategory: Record<CategoryPath, CategoryDetails> = {
        "now-playing": {
            params: `primary_release_date.gte=${this.pastFormattedDate}&primary_release_date.lte=${this.presentFormattedDate}`,
            name: "Now Playing",
            path: "now-playing"
        },
        "popular": {
            params: "",
            name: "Popular",
            path: "popular"
        },
        "top-rated": {
            params: "without_genres=99,10755&vote_count.gte=850&sort_by=vote_average.desc",
            name: "Top Rated",
            path: "top-rated"
        },
        "upcoming": {
            params: `with_release_type=2|3&primary_release_date.gte=${this.presentFormattedDate}`,
            name: "Upcoming",
            path: "upcoming"
        }
    };

    formatDate(date: Date) {
        const padStart = (num: number) => {
            return String(num).padStart(2, '0');
        };
        return `${date.getFullYear()}-${padStart(date.getMonth() + 1)}-${padStart(date.getDate())}`;
    }
}
