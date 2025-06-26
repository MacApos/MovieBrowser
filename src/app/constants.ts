type CategoryPath = "now-playing" | "popular" | "top-rated" | "upcoming"
type SortCriterion = "popularity" | "vote_average" | "primary_release_date";
type SortDirection = "asc" | "desc"
type SortParam = `${SortCriterion}.${SortDirection}`
type LanguageCode = "en" | "pl"
type CategoryDetails = {
    params: string,
    path: CategoryPath,
    sort: SortCriterion[]
}

type QueryParams = {
    language?: LanguageCode,
    sort_by?: SortParam,
    page?: number,
}

enum Theme {
    light = "light",
    dark = "dark",
}

enum Display {
    grid = "grid",
    list = "list"
}

const DEFAULT_LANGUAGE: LanguageCode = "en";
const LANGUAGE_DETAILS: Record<LanguageCode, Record<string, string>> = {
    en: {
        icon: "usa"
    },
    pl: {
        icon: "poland"
    }
};
const ALL_LANGUAGES: string[] = Object.keys(LANGUAGE_DETAILS);

const DEFAULT_CATEGORY: CategoryPath = "now-playing";
const START_PAGE = `${DEFAULT_CATEGORY}/1`;
const PAGE_NOT_FOUND = "page-not-found";
const SEARCH_PAGE = "search";
const MOVIE_DETAILS_PAGE = "movie-details";

function formatDate(date: Date) {
    const padStart = (num: number) => {
        return String(num).padStart(2, '0');
    };
    return `${date.getFullYear()}-${padStart(date.getMonth() + 1)}-${padStart(date.getDate())}`;
}

const presentDate = new Date();
const presentFormattedDate = formatDate(new Date());
const pastFormattedDate = formatDate(new Date(presentDate.setDate(presentDate.getDate() - 60)));

const MOVIE_CATEGORY: Record<CategoryPath, CategoryDetails> = {
    "now-playing": {
        params: `primary_release_date.gte=${pastFormattedDate}&primary_release_date.lte=${presentFormattedDate}`,
        sort: ["popularity", "vote_average", "primary_release_date"],
        path: "now-playing"
    },
    "popular": {
        params: "",
        sort: ["popularity"],
        path: "popular"
    },
    "top-rated": {
        params: "without_genres=99,10755&vote_count.gte=850&sort_by=vote_average.desc",
        sort: [],
        path: "top-rated"
    },
    "upcoming": {
        params: `with_release_type=2|3&primary_release_date.gte=${presentFormattedDate}`,
        sort: ["popularity", "vote_average", "primary_release_date"],
        path: "upcoming"
    }
};

enum WindowWidth {
    sm = 576,
    md = 768,
    lg = 992,
    xl = 1200,
}

export {
    DEFAULT_LANGUAGE,
    DEFAULT_CATEGORY,
    START_PAGE,
    PAGE_NOT_FOUND,
    SEARCH_PAGE,
    MOVIE_DETAILS_PAGE,
    MOVIE_CATEGORY,
    LANGUAGE_DETAILS,
    ALL_LANGUAGES,
    Theme,
    Display,
    WindowWidth
};
export type {
    CategoryPath,
    SortCriterion,
    SortDirection,
    SortParam,
    CategoryDetails,
    QueryParams,
    LanguageCode
};

