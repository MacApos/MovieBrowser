import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {catchError, forkJoin, filter, map, tap, EMPTY} from "rxjs";
import {CategoryPath, LanguageCode, MOVIE_CATEGORY, PAGE_NOT_FOUND, QueryParams} from "./constants";
import {RouterService} from "./router.service";

type MapResponseFn = (response: Record<string, any>) => any ;

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    http = inject(HttpClient);
    routerService = inject(RouterService);
    baseUrl = "https://api.themoviedb.org/3";
    baseParams = "/movie?include_adult=false&include_video=false";
    searchUrl = "/search";
    discoverUrl = "/discover";
    movieDetailsUrl = "/movie";

    imageUrl = "https://image.tmdb.org/t/p";
    headers = {
        accept: "application/json",
        Authorization: `Bearer ${environment.apiKey}`
    };

    getImage(path: string) {
        return path ? `${this.imageUrl}/w500${path}` : "/img/poster_unavailable.svg";
    }

    getMovies(category: string, params: QueryParams = {}) {
        let httpParams = new HttpParams({
            fromString: MOVIE_CATEGORY[category as CategoryPath].params
        });
        for (const [key, value] of Object.entries(params)) {
            if (!httpParams.has(key) && value) {
                httpParams = httpParams.set(key, value);
            }
        }
        return this.getRequest(this.discoverUrl + this.baseParams, httpParams, this.mapMovies);
    }

    searchMovie(query: string, language: LanguageCode) {
        const httpParams = new HttpParams({fromObject: {language, page: 1, query}});
        return this.getRequest(this.searchUrl + this.baseParams, httpParams, this.sortMovies);
    }

    getMovieById(movieId: number, language: LanguageCode) {
        const httpParams = new HttpParams({fromObject: {language}});
        const movieIdUrl = [this.movieDetailsUrl, movieId].join("/");
        return forkJoin([
            this.getRequest(movieIdUrl, httpParams, this.mapMovieDetails),
            this.getRequest([movieIdUrl, "credits"].join("/"), httpParams, this.mapMovieCredits),
            this.getRequest([movieIdUrl, "recommendations"].join("/"), httpParams, this.getResults)]
        );
    }

    getResults = (response: Record<string, any>): Record<string, any>[] =>
        response["results"];

    mapMovies: MapResponseFn = (response) => {
        const result: Record<string, any> = {
            totalPages: response["total_pages"],
            results: this.getResults(response)
        };
        return result;
    };

    sortMovies = (response: Record<string, any>) => {
        return this.getResults(response).sort((a, b) =>
            b["popularity"] - a["popularity"]);
    };

    mapMovieDetails: MapResponseFn = (response) => {
        const runtime = response["runtime"];
        const result: Record<string, any> = {
            genres: response["genres"].map((genre: Record<string, any>) => genre["name"]).join(", "),
            production_countries: response["production_countries"].map((country: Record<string, any>) => country["name"]),
            runtime: `${Math.floor(runtime / 60)}h ${runtime % 60}m`
        };
        return {...response, ...result};
    };

    mapMovieCredits: MapResponseFn = (response) => {
        const result: Record<string, any> = {
            cast: response["cast"]
                .filter((member: Record<string, any>) => member["known_for_department"] === "Acting" && member["order"] < 3)
                .map((member: Record<string, any>) => [member["name"], member["character"]].filter(Boolean).join(" - "))
                .join(", "),
            crew: response["crew"]
                .filter((member: Record<string, any>) => member["job"] === "Director")
                .map((member: Record<string, any>) => member["name"])
        };
        return result;
    };

    getRequest(url: string, params: HttpParams, mapResponse: MapResponseFn) {
        return this.http.get(this.baseUrl + url, {
            params,
            headers: this.headers,
            observe: "response"
        }).pipe(
            catchError(() => {
                this.routerService.navigate([PAGE_NOT_FOUND]);
                return EMPTY;
            }),
            map((response: HttpResponse<Record<string, any>>) => response.body),
            tap(value => {
                const page = Number(params.get("page"));
                const totalPages = value?.["total_pages"];
                if (!value || totalPages && page > Math.min(30, totalPages)) {
                    this.routerService.navigate([PAGE_NOT_FOUND]);
                    return EMPTY;
                }
                return value;
            }),
            filter((value) => value != null),
            map(mapResponse),
        );
    }
}
