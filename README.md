## About The Project

This project is a simple and interactive application that allows users to browse, search, and view details about films.
It was built with Angular and Bootstrap to provide a clean and responsive UI.

## Features

- Search movies by title
- View movies details - title, description, rating, release date, etc.
- Paginated results for smooth browsing
- Responsive design for desktop and mobile

## Technologies

- Angular
- Bootstrap

## Installation

1. Clone the repository
   ```sh
   git clone git@github.com:MacApos/MovieBrowser.git
   ```
2. Go to the project's main directory
   ```sh
   cd MovieBrowser
   ```
3. Install Node dependencies
   ```sh
   npm install
   ```
4. Lunch Angular server
   ```sh
   ng serve --open
   ```

## Endpoints

- `/{language}/{category}/{page}` - lets users explore a paginated list of movies.

  **Path parameters**
    - language: en (default) or pl
    - category: now-playing (default), popular, top-rated or upcoming
    - page: from 1 to max 30

  **Additional options:**
    - Display results as grid or list
    - Sort by popularity, average vote, or release date

- `/{language}/movie-details/{movieId}` - retrieves a movie by its ID
- `/{language}/search?query=` - allow searching movies by title.

## Contact

Email: maciejapostol98@gmail.com

<p align="right"><a href="#about-the-project">back to top</a></p>