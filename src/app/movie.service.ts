import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {catchError, EMPTY, filter, forkJoin, map, merge, tap, throwError} from "rxjs";
import {CategoryPath, LanguageCode, MOVIE_CATEGORY, PAGE_NOT_FOUND, QueryParams} from "./constants";
import {RouterService} from "./router.service";

type MapResponse = (response: Record<string, any>) => Record<string, any>;

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
    movieCreditsUrl = "/movie";

    imageUrl = "https://image.tmdb.org/t/p";
    headers = {
        accept: "application/json",
        Authorization: `Bearer ${environment.apiKey}`
    };

    getImage(path: string) {
        return path ? `${this.imageUrl}/w500${path}` : "/img/poster_unavailable_dark.svg";
    }

    getMovies(path: string, params: QueryParams = {}) {
        let httpParams = new HttpParams({
            fromString: MOVIE_CATEGORY[path as CategoryPath].params
        });
        for (const [key, value] of Object.entries(params)) {
            if (!httpParams.has(key) && value) {
                httpParams = httpParams.set(key, value);
            }
        }
        return this.getRequest(this.discoverUrl + this.baseParams, httpParams, this.mapMovies);
    }

    searchMovie(query: string, params: QueryParams = {}) {
        const httpParams = new HttpParams({fromObject: {query, ...params}});
        return this.getRequest(this.searchUrl + this.baseParams, httpParams, this.mapMovies);
    }

    getMovieById(movieId: number, language: LanguageCode) {
        const httpParams = new HttpParams({fromObject: {language}});
        return forkJoin([
            this.getRequest(this.movieDetailsUrl + "/" + movieId, httpParams, this.mapMovieDetails),
            this.getRequest([this.movieCreditsUrl, movieId, "credits"].join("/"), httpParams, this.mapMovieCredits)]
        );
    }

    mapMovies: MapResponse = (response) => {
        const result: Record<string, any> = {
            totalPages: response["total_pages"],
            results: response["results"]
        };
        return result;
    };

    mapMovieDetails: MapResponse = (response) => {
        const runtime = response["runtime"];
        const result: Record<string, any> = {
            genres: response["genres"].map((genre: Record<string, any>) => genre["name"]).join(", "),
            production_countries: response["production_countries"].map((country: Record<string, any>) => country["name"]),
            runtime: `${Math.floor(runtime / 60)}h ${runtime % 60}m`
        };
        return {...response, ...result};
    };

    mapMovieCredits: MapResponse = (response) => {
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

    getRequest(url: string, params: HttpParams, mapResponseFn: MapResponse) {
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
                if (!value) {
                    this.routerService.navigate([PAGE_NOT_FOUND]);
                    return EMPTY;
                }
                if (params.has("page") && value["total_pages"]) {
                    if (Number(params.get("page")) > Math.min(30, value["total_pages"])) {
                        this.routerService.navigate([PAGE_NOT_FOUND]);
                        return EMPTY;
                    }
                }
                return value;
            }),
            filter((value) => value != null),
            map(mapResponseFn),
        );
    }
}
