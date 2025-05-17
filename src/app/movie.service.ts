import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import {LanguageCode} from "./language-change/language-change.component";

export type CategoryKey = "nowPlaying" | "popular" | "topRated" | "upcoming"
export type CategoryDetails = {
    name: string,
    path: string,
    params: string,
}
export type SortCriteria = "popularity" | "title" | "vote_average" | "primary_release_date";
export type SortDirection = "asc" | "desc"
export type QueryParams = {
    language?: LanguageCode,
    page?: number,
    sortBy?: `${SortCriteria}.${SortDirection}`,
}

@Injectable({
    providedIn: "root"
})
export class MovieService {
    movieCategory: Record<CategoryKey, CategoryDetails> = {
        nowPlaying: {
            params: "&with_release_type=2|3&release_date.gte={min_date}&release_date.lte={max_date}",
            name: "Now Playing",
            path: "now-playing"
        },
        popular: {
            params: "",
            name: "Popular",
            path: "popular"
        },
        topRated: {
            params: "&without_genres=99,10755&vote_count.gte=200",
            name: "Top Rated",
            path: "top-rated"
        },
        upcoming: {
            params: "&with_release_type=2|3&release_date.gte=",
            name: "Upcoming",
            path: "upcoming"
        }
    };

    constructor() {
        // Object.keys(this.movieCategory).forEach((key) => {
        //     const castedKey = key as CategoryKey;
        //     const formattedName = key.replace(/([A-Z])/g, " $1");
        //     this.movieCategory[castedKey] = {
        //         name: formattedName[0].toUpperCase() + formattedName.slice(1),
        //         path: formattedName.replace(" ", "-").toLowerCase(),
        //         ...this.movieCategory[castedKey]
        //     };
        // });

        const today = new Date();

        const padStart = (num: number) => {
            return String(num).padStart(2, '0');
        };

        this.movieCategory.upcoming.params +=
            `${today.getFullYear()}-${padStart(today.getMonth() + 1)}-${padStart(today.getDate())}`;
    }

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

    async getAllMovies(categoryKey: CategoryKey, queryParams:  QueryParams= {}) {
        const additionalParams = new URLSearchParams();
        for (const [key, value] of Object.entries(queryParams)) {
            additionalParams.append(key, String(value));
        }
        const categoryParams = this.movieCategory[categoryKey].params;
        const input = `${this.url}?${[categoryParams, additionalParams.toString()].filter(Boolean).join("&")}`;
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
