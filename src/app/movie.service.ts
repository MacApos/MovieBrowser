import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import {LanguageCode} from "./language-change/language-change.component";

export type CategoryPath = "now-playing" | "popular" | "top-rated" | "upcoming"

export type CategoryDetails = {
    name: string,
    path: CategoryPath,
    params: string,
}
export type SortCriteria = "popularity" | "title" | "vote_average" | "primary_release_date";
export type SortDirection = "asc" | "desc"
export type QueryParams = {
    language?: LanguageCode,
    page?: number,
    sort_by?: `${SortCriteria}.${SortDirection}`,
}

@Injectable({
    providedIn: "root"
})
export class MovieService {
    previousDate = new Date();
    currentFormattedDate = this.formatDate(new Date());
    previousFormattedDate = this.formatDate(new Date(this.previousDate.setDate(this.previousDate.getDate()-60)));

    movieCategory: Record<CategoryPath, CategoryDetails> = {
        "now-playing": {
            params: `primary_release_date.gte=${this.previousFormattedDate}&primary_release_date.lte=${this.currentFormattedDate}`,
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
            params: `with_release_type=2|3&primary_release_date.gte=${this.currentFormattedDate}`,
            name: "Upcoming",
            path: "upcoming"
        }
    };

    url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false";
    imageUrl = "https://image.tmdb.org/t/p";
    init: RequestInit = {
        method: "GET",
        headers:
            {
                accept: "application/json",
                Authorization: `Bearer ${environment.apiKey}`
            }
    };

    formatDate(date: Date) {
        const padStart = (num: number) => {
            return String(num).padStart(2, '0');
        };
        return `${date.getFullYear()}-${padStart(date.getMonth() + 1)}-${padStart(date.getDate())}`;
    }

    async getAllMovies(categoryPath: CategoryPath, queryParams: QueryParams = {}) {
        const params = new URLSearchParams(this.movieCategory[categoryPath].params);
        for (const [key, value] of Object.entries(queryParams)) {
            if (params.has(key)) {
                params.delete(key);
            }
            params.append(key, String(value));
        }
        params.sort();
        const input = `${this.url}&${params.toString()}`;
        console.log(input);
        const response = await fetch(input, this.init);
        const json = await response.json();
        return json ? json.results : [];
    }

    getImage(path: string) {
        return `${this.imageUrl}/w500${path}`;
    }

    async getMovieById(movieId: number) {
        await fetch(`${this.url}/movieId`, this.init);
    }


}
