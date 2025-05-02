import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
	MoviesResponse,
	MovieWinnersByYearResponse,
	MultipleWinnersYearResponse,
	ProducerWinIntervalResponse,
	StudiosWinCountResponse
} from '../../core/models/movies.model'

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
	private readonly moviesApiUrl = `${environment.apiUrl}/movies`

	constructor(private http: HttpClient) { }

	/** Returns the list of films.
	 * @param page - The page number for pagination.
	 * @param size - The number of items per page for pagination.
	 * @param year - Filter by year (optional).
	 * @param winner - Filter by winner status (optional).
	*/
	getMovies(page: number, size: number, year: number | null, winner: boolean | string): Observable<MoviesResponse> {

		let params = new HttpParams()
			.set('page', page)
			.set('size', size);

		if (year !== null) {
			params = params.set('year', year);
		}

		if (winner !== 'Yes/No') {
			params = params.set('winner', winner);
		}

		return this.http.get<MoviesResponse>(this.moviesApiUrl, { params });
	}

	/** Returns the list of winning films by year.
	 * * @param year - The year to filter the movies by.
	*/
	getMovieWinnersByYear(year: number): Observable<MovieWinnersByYearResponse[]> {
		const params = new HttpParams()
			.set('winner', true)
			.set('year', year);

		return this.http.get<MovieWinnersByYearResponse[]>(this.moviesApiUrl, {params})
	}

	/** Returns the years that had multiple winners. */
	getYearsMultipleWinners(): Observable<MultipleWinnersYearResponse> {
		return this.getMoviesWithProjection<MultipleWinnersYearResponse>('years-with-multiple-winners');
	}

	/**
	** Returns all winning studios and their number.
	** Sorted by Number of wins.
	**/
	getStudiosWinCount(): Observable<StudiosWinCountResponse> {
		return this.getMoviesWithProjection<StudiosWinCountResponse>('studios-with-win-count');
	}

	/** Returns the producers with the highest and lowest win interval. */
	getWinIntervalProducer(): Observable<ProducerWinIntervalResponse> {
		return this.getMoviesWithProjection<ProducerWinIntervalResponse>('max-min-win-interval-for-producers');
	}

	private getMoviesWithProjection<T>(projection: string): Observable<T> {
		const params = new HttpParams().set('projection', projection);
		return this.http.get<T>(this.moviesApiUrl, { params });
	}
}
