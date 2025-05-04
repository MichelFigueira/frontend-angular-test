import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { MoviesService } from '../../shared/services/movies.service';
import {
	MultipleWinnersYear,
	ProducerWinInterval,
	StudiosWinCount
} from '../../core/models/movies.model';
import { TableData } from '../../core/models/table-data.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, DataTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
/**
	* Represents the main dashboard component of the application.
	* This component is responsible for fetching and displaying various statistics
	* related to movie awards, organized into different sections (tables).
	* It utilizes the `MoviesService` to retrieve data from the backend API.
 */
export class DashboardComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	private yearInputSubject = new Subject<number>();
	yearInput: number | null = null;

	// Data for the multiple winners table.
	yearsMultipleWinnersTitle = 'List years with multiple winners';
	yearsMultipleWinnersData: TableData = {
		data: [] as MultipleWinnersYear[],
		columns: [
			{ field: 'year', header: 'Year' },
			{ field: 'winnerCount', header: 'Win Count' }
		]
	};

	// Data for the studios with most winners table.
	studiosWinCountTitle = 'Top 3 studios with winners';
	studiosWinCountData: TableData = {
		data: [] as StudiosWinCount[],
		columns: [
			{ field: 'name', header: 'Name' },
			{ field: 'winCount', header: 'Win Count' }
		]
	};

	// Data for the producers with longest and shortest interval between wins table.
	producerWinIntervalTitle = 'Producers with longest and shortest interval between wins';
	producerWinIntervalDataMin: TableData = {
		data: [] as ProducerWinInterval[],
		columns: [
			{ field: 'producer', header: 'Producer' },
			{ field: 'interval', header: 'Interval' },
			{ field: 'previousWin', header: 'Previous Year' },
			{ field: 'followingWin', header: 'Following Year' }
		]
	};
	producerWinIntervalDataMax: TableData = {
		data: [] as ProducerWinInterval[],
		columns: [
			{ field: 'producer', header: 'Producer' },
			{ field: 'interval', header: 'Interval' },
			{ field: 'previousWin', header: 'Previous Year' },
			{ field: 'followingWin', header: 'Following Year' }
		]
	};

	// Data for the movie winners by year table.
	movieWinnersByYearTitle = 'List movie winners by year';
	movieWinnersByYearData: TableData = {
		data: [] as StudiosWinCount[],
		columns: [
			{ field: 'id', header: 'Id' },
			{ field: 'year', header: 'Year' },
			{ field: 'title', header: 'Title' }
		]
	};

	constructor(
		private moviesService: MoviesService
	) {}

	ngOnInit(): void {
		this.getYearsMultipleWinners();
		this.getStudiosWinCount(3);
		this.getWinIntervalProducer();

		// Subscribe to the year input subject to fetch winners by year after a debounce time.
		this.yearInputSubject.pipe(debounceTime(500)).subscribe((year) => {
			if (year >= 1000) this.fetchWinnersByYear(year);
		});
	}

	/**
	 * Fetches the years with multiple winners from the movies service.
	 */
	getYearsMultipleWinners(): void {
		this.moviesService.getYearsMultipleWinners().subscribe((res) => {
			this.yearsMultipleWinnersData.data = res.years;
		})
	}

	/**
	 * Fetches the win count for studios from the movies service.
	 */
	getStudiosWinCount(recordLimit: number): void {
		this.moviesService.getStudiosWinCount().subscribe((res) => {
			this.studiosWinCountData.data = res.studios.slice(0, recordLimit);
		})
	}

	/**
	 * Fetches the minimum and maximum win intervals for producers
	 */
	getWinIntervalProducer(): void {
		this.moviesService.getWinIntervalProducer().subscribe((res) => {
			this.producerWinIntervalDataMin.data = res.min;
			this.producerWinIntervalDataMax.data = res.max;
		})
	}

	/**
	 * Handles the input change event for the year input field.
	 */
	onYearInputChange(year: number | null): void {
		if (year !== null) {
			this.yearInputSubject.next(year);
		}
	}

	/**
	 * Fetches movie winners for a specific year and updates the component's data.
	 */
	fetchWinnersByYear(year: number): void {
		this.moviesService.getMovieWinnersByYear(year).subscribe((res) => {
			this.movieWinnersByYearData.data = res;
		});
	}

	/**
	 * Lifecycle hook that is called when the component is about to be destroyed.
	 * Unsubscribes from any active subscriptions to prevent memory leaks.
	 */
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
