import { TestBed } from '@angular/core/testing';
import { MoviesService } from './movies.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
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
});
