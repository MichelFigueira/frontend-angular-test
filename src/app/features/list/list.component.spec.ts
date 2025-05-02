import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ListComponent } from './list.component';
import { of, throwError } from 'rxjs';
import { MoviesService } from '../../shared/services/movies.service';
import { MoviesResponse } from '../../core/models/movies.model';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

	let moviesService: MoviesService;
	const mockMoviesResponse: MoviesResponse = {
		content: [{ id: 1, year: 2000, title: 'Movie 1', studios: ['Studio 1'], producers: ['Producer 1'], winner: true }],
		pageable: {
			sort: { sorted: false, unsorted: true, empty: true },
			offset: 0,
			pageNumber: 0,
			pageSize: 15,
			paged: true,
			unpaged: false
		},
		totalPages: 2,
		totalElements: 20,
		last: false,
		size: 15,
		number: 0,
		sort: { sorted: false, unsorted: true, empty: true },
		numberOfElements: 15,
		first: true,
		empty: false
	};

	beforeEach(() => {
		moviesService = TestBed.inject(MoviesService);
	});

	it('should call getFilteredMovies on init', () => {
		spyOn(component, 'getFilteredMovies');
		component.ngOnInit();
		expect(component.getFilteredMovies).toHaveBeenCalled();
	});

	it('should fetch movies and update pagination on getFilteredMovies success', () => {
		spyOn(moviesService, 'getMovies').and.returnValue(of(mockMoviesResponse));
		spyOn(component, 'updatePagination');

		component.currentPage = 0;
		component.pageSize = 15;
		component.filterYear = null;
		component.filterWinner = 'Yes/No';
		component.getFilteredMovies();

		expect(moviesService.getMovies).toHaveBeenCalledWith(0, 15, null, 'Yes/No');
		expect(component.movies).toEqual(mockMoviesResponse);
		expect(component.updatePagination).toHaveBeenCalledWith(mockMoviesResponse);
	});

	it('should handle error on getFilteredMovies failure', () => {
		const errorResponse = new Error('Failed to fetch');
		spyOn(moviesService, 'getMovies').and.returnValue(throwError(() => errorResponse));
		spyOn(console, 'error');

		component.getFilteredMovies();

		expect(moviesService.getMovies).toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledWith('Error to get movies: ', errorResponse);
		expect(component.movies).toBeUndefined();
	});

	it('should apply filters, reset pagination, and fetch movies', () => {
		spyOn(component, 'getFilteredMovies');
		component.filterYear = 2020;
		component.currentPage = 1; // Set to a non-zero page
		component.totalPages = 5; // Set to a non-zero total pages

		component.applyFilters();

		expect(component.currentPage).toBe(0);
		expect(component.totalPages).toBe(0);
		expect(component.getFilteredMovies).toHaveBeenCalled();
	});

	it('should not apply filters if year is invalid', () => {
		spyOn(component, 'getFilteredMovies');
		spyOn(console, 'warn');
		component.filterYear = 1899;

		component.applyFilters();

		expect(console.warn).toHaveBeenCalledWith('Invalid Year');
		expect(component.getFilteredMovies).not.toHaveBeenCalled();
	});

	it('should update pagination properties', () => {
		spyOn(component, 'updateVisiblePages');
		component.updatePagination(mockMoviesResponse);

		expect(component.currentPage).toBe(mockMoviesResponse.number);
		expect(component.totalPages).toBe(mockMoviesResponse.totalPages);
		expect(component.pages).toEqual([1, 2]); // Based on totalPages: 2
		expect(component.updateVisiblePages).toHaveBeenCalled();
	});

	it('should go to a specific page', () => {
		spyOn(component, 'getFilteredMovies');
		component.goToPage(2);
		expect(component.currentPage).toBe(1);
		expect(component.getFilteredMovies).toHaveBeenCalled();
	});

	it('should go to the previous page', () => {
		spyOn(component, 'changePage');
		component.currentPage = 1;
		component.goToPreviousPage();
		expect(component.changePage).toHaveBeenCalledWith(0);
	});

	it('should go to the next page', () => {
		spyOn(component, 'changePage');
		component.currentPage = 0;
		component.totalPages = 3;
		component.goToNextPage();
		expect(component.changePage).toHaveBeenCalledWith(1);
	});

	it('should go to the first page', () => {
		spyOn(component, 'changePage');
		component.currentPage = 2;
		component.goToFirstPage();
		expect(component.changePage).toHaveBeenCalledWith(0);
	});

	it('should go to the last page', () => {
		spyOn(component, 'changePage');
		component.currentPage = 0;
		component.totalPages = 5;
		component.goToLastPage();
		expect(component.changePage).toHaveBeenCalledWith(4);
	});

	it('should change page and fetch movies if page is valid and different', () => {
		spyOn(component, 'getFilteredMovies');
		component.currentPage = 1;
		component.totalPages = 5;

		component.changePage(3);

		expect(component.currentPage).toBe(3);
		expect(component.getFilteredMovies).toHaveBeenCalled();
	});

	it('should not change page or fetch movies if page is invalid (negative)', () => {
		spyOn(component, 'getFilteredMovies');
		component.currentPage = 1;
		component.totalPages = 5;

		component.changePage(-1);

		expect(component.currentPage).toBe(1); // Stays the same
		expect(component.getFilteredMovies).not.toHaveBeenCalled();
	});

	it('should not change page or fetch movies if page is invalid (out of bounds)', () => {
		spyOn(component, 'getFilteredMovies');
		component.currentPage = 1;
		component.totalPages = 5;

		component.changePage(5); // totalPages is 5, so valid pages are 0, 1, 2, 3, 4

		expect(component.currentPage).toBe(1); // Stays the same
		expect(component.getFilteredMovies).not.toHaveBeenCalled();
	});

	it('should not change page or fetch movies if page is the same', () => {
		spyOn(component, 'getFilteredMovies');
		component.currentPage = 1;
		component.totalPages = 5;

		component.changePage(1);

		expect(component.currentPage).toBe(1); // Stays the same
		expect(component.getFilteredMovies).not.toHaveBeenCalled();
	});

	it('should update visible pages correctly (start)', () => {
		component.totalPages = 10;
		component.currentPage = 0; // Page 1
		component.maxVisiblePages = 5;
		component.updateVisiblePages();
		expect(component.visiblePages).toEqual([1, 2, 3, 4, 5]);
	});

	it('should update visible pages correctly (middle)', () => {
		component.totalPages = 10;
		component.currentPage = 4; // Page 5
		component.maxVisiblePages = 5;
		component.updateVisiblePages();
		expect(component.visiblePages).toEqual([3, 4, 5, 6, 7]);
	});

	it('should update visible pages correctly (end)', () => {
		component.totalPages = 10;
		component.currentPage = 8; // Page 9
		component.maxVisiblePages = 5;
		component.updateVisiblePages();
		expect(component.visiblePages).toEqual([6, 7, 8, 9, 10]);
	});

	it('should update visible pages correctly (less than max)', () => {
		component.totalPages = 3;
		component.currentPage = 1; // Page 2
		component.maxVisiblePages = 5;
		component.updateVisiblePages();
		expect(component.visiblePages).toEqual([1, 2, 3]);
	});

	it('should update visible pages correctly (near end)', () => {
		component.totalPages = 10;
		component.currentPage = 7; // Page 8
		component.maxVisiblePages = 5;
		component.updateVisiblePages();
		expect(component.visiblePages).toEqual([6, 7, 8, 9, 10]);
	});
});
