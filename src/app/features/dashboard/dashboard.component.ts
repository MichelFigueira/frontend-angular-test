import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { MoviesService } from '../../shared/services/movies.service';
import {
	MovieWinnersByYearResponse,
	MultipleWinnersYear,
	ProducerWinIntervalResponse,
	StudiosWinCount
} from '../../core/models/movies.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();

	yearsMultipleWinnersData: MultipleWinnersYear[] = [];
	yearsMultipleWinnersTitle = 'List years with multiple winners';

	studiosWinCountData: StudiosWinCount[] = [];
	studiosWinCountTitle = 'Top 3 studios with winners';

	producerWinIntervalData?: ProducerWinIntervalResponse;
	producerWinIntervalTitle = 'Producers with longest and shortest interval between wins';

	private yearInputSubject = new Subject<number>();
	yearInput: number | null = null;
	movieWinnersByYearData?: MovieWinnersByYearResponse[];
	movieWinnersByYearTitle = 'List movie winners by year';

	constructor(
		private moviesService: MoviesService
	) {}

	ngOnInit(): void {
		this.getYearsMultipleWinners();
		this.getStudiosWinCount(3);
		this.getWinIntervalProducer();

		this.yearInputSubject.pipe(debounceTime(500)).subscribe((year) => {
			if (year >= 1000) this.fetchWinnersByYear(year);
		});
	}

	getYearsMultipleWinners(): void {
		this.moviesService.getYearsMultipleWinners().subscribe((res) => {
			this.yearsMultipleWinnersData = res.years;
		})
	}

	getStudiosWinCount(recordLimit: number): void {
		this.moviesService.getStudiosWinCount().subscribe((res) => {
			this.studiosWinCountData = res.studios.slice(0, recordLimit);
		})
	}

	getWinIntervalProducer(): void {
		this.moviesService.getWinIntervalProducer().subscribe((res) => {
		this.producerWinIntervalData = res;
		})
	}

	onYearInputChange(year: number | null): void {
		if (year !== null) {
			this.yearInputSubject.next(year);
		}
	}

	private fetchWinnersByYear(year: number): void {
		this.moviesService.getMovieWinnersByYear(year).subscribe((res) => {
			this.movieWinnersByYearData = res;
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
