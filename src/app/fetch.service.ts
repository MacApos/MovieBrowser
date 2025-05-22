import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {QueryParams} from "./movie.service";
import {environment} from "../environments/environment";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FetchService {
    http = inject(HttpClient);
    baseUrl = "https://api.themoviedb.org/3/";
    searchUrl = `${this.baseUrl}search/movie?include_adult=false`;
    imageUrl = "https://image.tmdb.org/t/p";
    headers = {
        accept: "application/json",
        Authorization: `Bearer ${environment.apiKey}`
    };

    searchMovie(query: string, params: QueryParams = {}) {
        return this.http.get(`${this.searchUrl}`, {
            params: {
                query,
                ...params,
            },
            headers: this.headers,
            observe: "response"
        }).pipe(map((response: HttpResponse<Record<string, any>>) => {
                // TODO: better error handling
                if (response.body && response.body["total_pages"] && response.body["results"]) {
                    return {
                        totalPages: response.body["total_pages"],
                        results: response.body["results"]
                    };
                }
                return null;
            }
        ));

    }
}
