import { Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RouteService {
    startPage = "now-playing/1";
    pageNotFound = "page-not-found";
    searchPage = "search";
}
