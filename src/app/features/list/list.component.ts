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

	applyFilters(): void {
		if (this.filterYear && this.filterYear < 1900) {
			console.warn('Invalid Year');
			return;
		}

		this.currentPage = 0;
		this.totalPages = 0;
		this.getFilteredMovies();
	}

	updatePagination(movies: MoviesResponse): void {
		this.currentPage = movies.number;
		this.totalPages = movies.totalPages;
		this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
		this.updateVisiblePages();
	}

	goToPage(page: number): void {
		this.currentPage = page - 1;
		this.getFilteredMovies();
	}

	goToPreviousPage(): void {
		this.changePage(this.currentPage - 1);
	}

	goToNextPage(): void {
		this.changePage(this.currentPage + 1);
	}

	goToFirstPage(): void {
		this.changePage(0);
	}

	goToLastPage(): void {
		this.changePage(this.totalPages - 1);
	}

	changePage(page: number): void {
		if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
		  this.currentPage = page;
		  this.getFilteredMovies();
		}
	}

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
