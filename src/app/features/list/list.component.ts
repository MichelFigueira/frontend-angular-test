import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MoviesResponse, MovieWinnersByYearResponse } from '../../core/models/movies.model';
import { MoviesService } from '../../shared/services/movies.service';

@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
 /**
	* This component is responsible for displaying a paginated list of movies,
	* allowing users to filter by year and winner status.
	* It utilizes the `MoviesService` to retrieve data from the backend API.
	* The component also handles pagination and updates the visible pages based on user interaction.
 */
export class ListComponent implements OnInit {
	title = 'List movies';
	movies!: MoviesResponse;

	filterYear: number | null = null;
	filterWinner: string = 'Yes/No';

	currentPage = 0;
	pageSize = 15;
	totalPages = 0;
	pages: number[] = [];
	visiblePages: number[] = [];
	maxVisiblePages = 5;

	constructor(
		private moviesService: MoviesService
	) {}

	ngOnInit(): void {
		this.getFilteredMovies();
	}

	/**
	 * Fetches filtered movies based on the current page, page size, year, and winner filter, and updates the pagination.
	 */
	getFilteredMovies(): void {
		this.moviesService.getMovies(this.currentPage, this.pageSize, this.filterYear, this.filterWinner).subscribe({
			next: (res) => {
			  this.movies = res;
			  this.updatePagination(res);
			},
			error: (err) => {
			  console.error('Error to get movies: ', err);
			}
		  });
	}

	/**
	 * Applies filters to the movie list, validating the year and resetting pagination.
	 */
	applyFilters(): void {
		if (this.filterYear && this.filterYear < 1900) {
			console.warn('Invalid Year');
			return;
		}

		this.currentPage = 0;
		this.totalPages = 0;
		this.getFilteredMovies();
	}

	/**
	 * Updates the pagination state based on the provided movies response.
	 */
	updatePagination(movies: MoviesResponse): void {
		this.currentPage = movies.number;
		this.totalPages = movies.totalPages;
		this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
		this.updateVisiblePages();
	}

	/**
	 * Navigates to the specified page and fetches the filtered movies.
	 */
	goToPage(page: number): void {
		this.currentPage = page - 1;
		this.getFilteredMovies();
	}

	/**
	 * Navigates to the previous page.
	 */
	goToPreviousPage(): void {
		this.changePage(this.currentPage - 1);
	}

	/**
	 * Advances to the next page.
	 */
	goToNextPage(): void {
		this.changePage(this.currentPage + 1);
	}

	/**
	 * Navigates to the first page by setting the current page index to 0.
	 */
	goToFirstPage(): void {
		this.changePage(0);
	}

	/**
	 * Navigates to the last page of the list.
	 */
	goToLastPage(): void {
		this.changePage(this.totalPages - 1);
	}

	/**
	 * Changes the current page if the specified page is valid and different from the current one, then fetches filtered movies.
	 */
	changePage(page: number): void {
		if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
		  this.currentPage = page;
		  this.getFilteredMovies();
		}
	}

	/**
	 * Updates the range of visible pages based on the current page and total pages.
	 */
	updateVisiblePages(): void {
		const total = this.totalPages;
		const current = this.currentPage + 1;
		let start = Math.max(current - Math.floor(this.maxVisiblePages / 2), 1);
		let end = start + this.maxVisiblePages - 1;

		if (end > total) {
		  end = total;
		  start = Math.max(end - this.maxVisiblePages + 1, 1);
		}

		this.visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}
}
