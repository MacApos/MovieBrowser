type CategoryPath = "now-playing" | "popular" | "top-rated" | "upcoming"
type SortCriterion = "popularity" | "vote_average" | "primary_release_date";
type SortDirection = "asc" | "desc"
type SortParam = `${SortCriterion}.${SortDirection}`
type Sort = {
    name: string
    criterion: SortCriterion
    direction: SortDirection
}

type CategoryDetails = {
    name: string,
    path: CategoryPath,
    params: string,
}

type QueryParams = {
    language?: LanguageCode,
    sort_by?: SortParam,
    page?: number,
}

type LanguageCode = "en" | "pl"


enum EnumLanguageCode {
    english = "en",
    polish = "pl"
}

const LANGUAGE_DETAILS: Record<LanguageCode, Record<string , string>> = {
    en: {
        code: "en-US",
        icon: "usa"
    },
    pl: {
        code: "pl-PL",
        icon: "poland"
    }
};

const START_PAGE = "en/now-playing/1";
const PAGE_NOT_FOUND = "page-not-found";
const SEARCH_PAGE = "search";

const presentDate = new Date();
const presentFormattedDate = formatDate(new Date());
const pastFormattedDate = formatDate(new Date(presentDate.setDate(presentDate.getDate() - 60)));

const MOVIE_CATEGORY: Record<CategoryPath, CategoryDetails> = {
    "now-playing": {
        params: `primary_release_date.gte=${pastFormattedDate}&primary_release_date.lte=${presentFormattedDate}`,
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
        params: `with_release_type=2|3&primary_release_date.gte=${presentFormattedDate}`,
        name: "Upcoming",
        path: "upcoming"
    }
};

function formatDate(date: Date) {
    const padStart = (num: number) => {
        return String(num).padStart(2, '0');
    };
    return `${date.getFullYear()}-${padStart(date.getMonth() + 1)}-${padStart(date.getDate())}`;
}

export {START_PAGE, PAGE_NOT_FOUND, SEARCH_PAGE, MOVIE_CATEGORY, LANGUAGE_DETAILS, EnumLanguageCode};
export type {CategoryPath, SortCriterion, SortDirection, SortParam, Sort, CategoryDetails, QueryParams, LanguageCode};

