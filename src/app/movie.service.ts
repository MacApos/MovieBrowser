import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {filter, map} from "rxjs";
import {CategoryPath, MOVIE_CATEGORY, QueryParams} from "./constants";

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    http = inject(HttpClient);
    baseUrl = "https://api.themoviedb.org/3";
    baseParams = "/movie?include_adult=false&include_video=false";
    searchUrl = `/search`;
    discoverUrl = `/discover`;

    imageUrl = "https://image.tmdb.org/t/p";
    headers = {
        accept: "application/json",
        Authorization: `Bearer ${environment.apiKey}`
    };

    getImage(path: string) {
        return `${this.imageUrl}/w500${path}`;
    }

    mapResponseFn = (response: HttpResponse<Record<string, any>>) => {
        const body = response.body;
        if (body && body["total_pages"] && body["results"]) {
            return {totalPages: body["total_pages"], results: body["results"]};
        }
        return;
    };

    getMovies(path: string, params: QueryParams = {}) {
        let httpParams = new HttpParams({
            fromString:  MOVIE_CATEGORY[path as CategoryPath].params
        });
        for (const [key, value] of Object.entries(params)) {
            if (!httpParams.has(key) && value) {
                httpParams = httpParams.set(key, value);
            }
        }
        return this.getRequest(this.discoverUrl, httpParams, this.mapResponseFn);
    }

    searchMovie(query: string, params: QueryParams = {}) {
        const httpParams = new HttpParams({fromObject: {query, ...params}});
        return this.getRequest(this.searchUrl, httpParams, this.mapResponseFn);
    }

     getMovieById() {
    }

    getRequest(url: string, params: HttpParams, mapResponseFn: (value: HttpResponse<Record<string, any>>) =>
        Record<string, any> | undefined) {
        return this.http.get(this.baseUrl + url + this.baseParams, {
            params,
            headers: this.headers,
            observe: "response"
        })
            .pipe(map(mapResponseFn))
            .pipe(filter(response => response !== undefined));
    }

}
