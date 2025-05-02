import { TestBed } from '@angular/core/testing';
import { MoviesService } from './movies.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
	MoviesResponse,
	MovieWinnersByYearResponse,
	MultipleWinnersYearResponse,
	ProducerWinIntervalResponse,
	StudiosWinCountResponse
} from '../../core/models/movies.model';

describe('MoviesService', () => {
let service: MoviesService;
let httpMock: HttpTestingController;
const moviesApiUrl = `${environment.apiUrl}/movies`;

beforeEach(() => {
	TestBed.configureTestingModule({
		imports: [HttpClientTestingModule],
		providers: [MoviesService],
	});
	service = TestBed.inject(MoviesService);
	httpMock = TestBed.inject(HttpTestingController);
});

afterEach(() => {
	httpMock.verify(); // Make sure that there are no outstanding requests
});

it('should be created', () => {
	expect(service).toBeTruthy();
});

describe('getMovieWinnersByYear', () => {
	it('should return movie winners for a given year', () => {
		const mockYear = 2000;
		const mockResponse: MovieWinnersByYearResponse[] = [{ id: 1, year: mockYear, title: 'Test Movie', studios: ['Studio A'], producers: ['Producer A'], winner: true }];

		service.getMovieWinnersByYear(mockYear).subscribe(response => {
			expect(response).toEqual(mockResponse);
		});

		const req: TestRequest = httpMock.expectOne(
			`${moviesApiUrl}?winner=true&year=${mockYear}`
		);
		expect(req.request.method).toBe('GET');
		expect(req.request.params.get('winner')).toBe('true');
		expect(req.request.params.get('year')).toBe(mockYear.toString());
		req.flush(mockResponse);
	});
});

describe('getYearsMultipleWinners', () => {
	it('should return years with multiple winners', () => {
		const mockResponse: MultipleWinnersYearResponse = { years: [{ year: 1990, winnerCount: 2 }, { year: 2015, winnerCount: 2 }] };

		service.getYearsMultipleWinners().subscribe(response => {
			expect(response).toEqual(mockResponse);
		});

		const req: TestRequest = httpMock.expectOne(
			`${moviesApiUrl}?projection=years-with-multiple-winners`
		);
		expect(req.request.method).toBe('GET');
		expect(req.request.params.get('projection')).toBe('years-with-multiple-winners');
		req.flush(mockResponse);
	});
});

describe('getStudiosWinCount', () => {
	it('should return studios with their win counts', () => {
		const mockResponse: StudiosWinCountResponse = { studios: [{ name: 'Studio A', winCount: 5 }, { name: 'Studio B', winCount: 3 }] };

		service.getStudiosWinCount().subscribe(response => {
			expect(response).toEqual(mockResponse);
		});

		const req: TestRequest = httpMock.expectOne(
			`${moviesApiUrl}?projection=studios-with-win-count`
		);
		expect(req.request.method).toBe('GET');
		expect(req.request.params.get('projection')).toBe('studios-with-win-count');
		req.flush(mockResponse);
	});
});

describe('getWinIntervalProducer', () => {
	it('should return producer win intervals', () => {
		const mockResponse: ProducerWinIntervalResponse = {
			min: [{ producer: 'Producer Min', interval: 1, previousWin: 2000, followingWin: 2001 }],
			max: [{ producer: 'Producer Max', interval: 10, previousWin: 1990, followingWin: 2000 }]
		};

		service.getWinIntervalProducer().subscribe(response => {
			expect(response).toEqual(mockResponse);
		});

		const req: TestRequest = httpMock.expectOne(
			`${moviesApiUrl}?projection=max-min-win-interval-for-producers`
		);
		expect(req.request.method).toBe('GET');
		expect(req.request.params.get('projection')).toBe('max-min-win-interval-for-producers');
		req.flush(mockResponse);
	});
});
describe('getMovies', () => {
	it('should return movies for a given page and size', () => {
		const mockPage = 0;
		const mockSize = 10;
		const mockWinner = 'Yes/No';
		const mockResponse: MoviesResponse = {
			content: [{ id: 1, year: 2000, title: 'Test Movie 1', studios: ['Studio A'], producers: ['Producer A'], winner: false }],
			pageable: { sort: { sorted: false, unsorted: true, empty: true }, offset: 0, pageNumber: mockPage, pageSize: mockSize, paged: true, unpaged: false },
			totalPages: 1,
			totalElements: 1,
			last: true,
			size: mockSize,
			number: mockPage,
			sort: { sorted: false, unsorted: true, empty: true },
			first: true,
			numberOfElements: 1,
			empty: false
		};

		service.getMovies(mockPage, mockSize, null, mockWinner).subscribe(response => {
			expect(response).toEqual(mockResponse);
		});

		const req: TestRequest = httpMock.expectOne(
			`${moviesApiUrl}?page=${mockPage}&size=${mockSize}`
		);
		expect(req.request.method).toBe('GET');
		expect(req.request.params.get('page')).toBe(mockPage.toString());
		expect(req.request.params.get('size')).toBe(mockSize.toString());
		expect(req.request.params.has('year')).toBeFalse();
		expect(req.request.params.has('winner')).toBeFalse();
		req.flush(mockResponse);
	});

	it('should return movies filtered by year', () => {
		const mockPage = 0;
		const mockSize = 5;
		const mockYear = 2010;
		const mockWinner = 'Yes/No';
		const mockResponse: MoviesResponse = {
			content: [{ id: 2, year: mockYear, title: 'Test Movie 2', studios: ['Studio B'], producers: ['Producer B'], winner: false }],
			pageable: { sort: { sorted: false, unsorted: true, empty: true }, offset: 0, pageNumber: mockPage, pageSize: mockSize, paged: true, unpaged: false },
			totalPages: 1,
			totalElements: 1,
			last: true,
			size: mockSize,
			number: mockPage,
			sort: { sorted: false, unsorted: true, empty: true },
			first: true,
			numberOfElements: 1,
			empty: false
		};

		service.getMovies(mockPage, mockSize, mockYear, mockWinner).subscribe(response => {
			expect(response).toEqual(mockResponse);
		});

		const req: TestRequest = httpMock.expectOne(
			`${moviesApiUrl}?page=${mockPage}&size=${mockSize}&year=${mockYear}`
		);
		expect(req.request.method).toBe('GET');
		expect(req.request.params.get('page')).toBe(mockPage.toString());
		expect(req.request.params.get('size')).toBe(mockSize.toString());
		expect(req.request.params.get('year')).toBe(mockYear.toString());
		expect(req.request.params.has('winner')).toBeFalse();
		req.flush(mockResponse);
	});

	it('should return movies filtered by winner status (true)', () => {
		const mockPage = 1;
		const mockSize = 15;
		const mockWinner = true;
		const mockResponse: MoviesResponse = {
			content: [{ id: 3, year: 2015, title: 'Test Movie 3 Winner', studios: ['Studio C'], producers: ['Producer C'], winner: true }],
			pageable: { sort: { sorted: false, unsorted: true, empty: true }, offset: 15, pageNumber: mockPage, pageSize: mockSize, paged: true, unpaged: false },
			totalPages: 2,
			totalElements: 16,
			last: true,
			size: mockSize,
			number: mockPage,
			sort: { sorted: false, unsorted: true, empty: true },
			first: false,
			numberOfElements: 1,
			empty: false
		};

		service.getMovies(mockPage, mockSize, null, mockWinner).subscribe(response => {
			expect(response).toEqual(mockResponse);
		});

		const req: TestRequest = httpMock.expectOne(
			`${moviesApiUrl}?page=${mockPage}&size=${mockSize}&winner=true`
		);
		expect(req.request.method).toBe('GET');
		expect(req.request.params.get('page')).toBe(mockPage.toString());
		expect(req.request.params.get('size')).toBe(mockSize.toString());
		expect(req.request.params.has('year')).toBeFalse();
		expect(req.request.params.get('winner')).toBe('true');
		req.flush(mockResponse);
	});

	it('should return movies filtered by winner status (false)', () => {
		const mockPage = 0;
		const mockSize = 10;
		const mockWinner = false;
		const mockResponse: MoviesResponse = {
			content: [{ id: 4, year: 2018, title: 'Test Movie 4 Non-Winner', studios: ['Studio D'], producers: ['Producer D'], winner: false }],
			pageable: { sort: { sorted: false, unsorted: true, empty: true }, offset: 0, pageNumber: mockPage, pageSize: mockSize, paged: true, unpaged: false },
			totalPages: 1,
			totalElements: 1,
			last: true,
			size: mockSize,
			number: mockPage,
			sort: { sorted: false, unsorted: true, empty: true },
			first: true,
			numberOfElements: 1,
			empty: false
		};

		service.getMovies(mockPage, mockSize, null, mockWinner).subscribe(response => {
			expect(response).toEqual(mockResponse);
		});

		const req: TestRequest = httpMock.expectOne(
			`${moviesApiUrl}?page=${mockPage}&size=${mockSize}&winner=false`
		);
		expect(req.request.method).toBe('GET');
		expect(req.request.params.get('page')).toBe(mockPage.toString());
		expect(req.request.params.get('size')).toBe(mockSize.toString());
		expect(req.request.params.has('year')).toBeFalse();
		expect(req.request.params.get('winner')).toBe('false');
		req.flush(mockResponse);
	});

	it('should return movies filtered by year and winner status (true)', () => {
		const mockPage = 0;
		const mockSize = 10;
		const mockYear = 2020;
		const mockWinner = true;
		const mockResponse: MoviesResponse = {
			content: [{ id: 5, year: mockYear, title: 'Test Movie 5 Winner', studios: ['Studio E'], producers: ['Producer E'], winner: true }],
			pageable: { sort: { sorted: false, unsorted: true, empty: true }, offset: 0, pageNumber: mockPage, pageSize: mockSize, paged: true, unpaged: false },
			totalPages: 1,
			totalElements: 1,
			last: true,
			size: mockSize,
			number: mockPage,
			sort: { sorted: false, unsorted: true, empty: true },
			first: true,
			numberOfElements: 1,
			empty: false
		};

		service.getMovies(mockPage, mockSize, mockYear, mockWinner).subscribe(response => {
			expect(response).toEqual(mockResponse);
		});

		const req: TestRequest = httpMock.expectOne(
			`${moviesApiUrl}?page=${mockPage}&size=${mockSize}&year=${mockYear}&winner=true`
		);
		expect(req.request.method).toBe('GET');
		expect(req.request.params.get('page')).toBe(mockPage.toString());
		expect(req.request.params.get('size')).toBe(mockSize.toString());
		expect(req.request.params.get('year')).toBe(mockYear.toString());
		expect(req.request.params.get('winner')).toBe('true');
		req.flush(mockResponse);
	});
});
});
