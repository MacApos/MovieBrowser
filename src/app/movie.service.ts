import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, EMPTY, filter, forkJoin, map, tap} from "rxjs";
import {CategoryPath, LanguageCode, MOVIE_CATEGORY, PAGE_NOT_FOUND, QueryParams} from "./constants";
import {RouterService} from "./router.service";

type MapResponseFn = (response: Record<string, any>) => any;

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    http = inject(HttpClient);
    routerService = inject(RouterService);
    baseUrl = "https://api.themoviedb.org/3";
    baseParams = "/movie?include_adult=false&include_video=false";
    discoverUrl = "/discover";
    searchUrl = "/search";
    movieDetailsUrl = "/movie";

    imageUrl = "https://image.tmdb.org/t/p";
    headers = {
        accept: "application/json",
        Authorization: `Bearer ${process.env['API_KEY']}`
    };

    getImage(path: string) {
        return path ? `${this.imageUrl}/w500${path}` : "/img/poster_unavailable.svg";
    }

    getMovies(category: CategoryPath, params: QueryParams = {}) {
        let httpParams = new HttpParams({
            fromString: MOVIE_CATEGORY[category].params
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
        const hours = Math.floor(runtime / 60);
        const minutes = Math.floor(runtime % 60);
        const result: Record<string, any> = {
            genres: response["genres"].map((genre: Record<string, any>) => genre["name"]).join(", "),
            production_countries: response["production_countries"]
                .map((country: Record<string, any>) => country["name"]).join(", "),
            runtime: [hours ? `${hours}h` : '', minutes ? `${minutes}m` : ''].filter(Boolean).join(' ')
        };
        return {...response, ...result};
    };

    mapMovieCredits: MapResponseFn = (response) => {
        const result: Record<string, any> = {
            cast: response["cast"]
                .filter((member: Record<string, any>) =>
                    member["known_for_department"] === "Acting" && member["order"] < 3)
                .map((member: Record<string, any>) => [member["name"], member["character"]].filter(Boolean)
                    .join(" - ")),
            director: response["crew"]
                .filter((member: Record<string, any>) => member["job"] === "Director")
                .map((member: Record<string, any>) => member["name"])
        };
        Object.entries(result).forEach(([key, value]) => result[key] = value.join(", "));
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
            filter((value) => value != null),
            tap(value => {
                if (!value["total_pages"]) {
                    return;
                }
                const page = Number(params.get("page"));
                const totalPages = Math.min(30, Number(value["total_pages"]));
                if (page > totalPages) {
                    this.routerService.navigate([PAGE_NOT_FOUND]);
                    return EMPTY;
                }
                value["total_pages"] = totalPages;
                return value;
            }),
            map(mapResponse),
        );
    }
}
