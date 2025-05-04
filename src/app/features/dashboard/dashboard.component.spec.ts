import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { MoviesService } from '../../shared/services/movies.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
	  imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        MoviesService,
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

	it('should fetch years with multiple winners on initialization', () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		const moviesService = TestBed.inject(MoviesService);
		const mockResponse = { years: [{ year: 2000, winnerCount: 2 }] };

		spyOn(moviesService, 'getYearsMultipleWinners').and.returnValue(of(mockResponse));

		fixture.detectChanges();

		expect(component.yearsMultipleWinnersData.data).toEqual(mockResponse.years);
	});

	it('should fetch top 3 studios with winners on initialization', () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		const moviesService = TestBed.inject(MoviesService);
		const mockResponse = { studios: [{ name: 'Studio A', winCount: 5 }] };

		spyOn(moviesService, 'getStudiosWinCount').and.returnValue(of(mockResponse));

		fixture.detectChanges();

		expect(component.studiosWinCountData.data).toEqual(mockResponse.studios.slice(0, 3));
	});

	it('should fetch producer win intervals on initialization', () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		const moviesService = TestBed.inject(MoviesService);
		const mockResponse = { min: [], max: [] };

		spyOn(moviesService, 'getWinIntervalProducer').and.returnValue(of(mockResponse));

		fixture.detectChanges();

		expect(component.producerWinIntervalDataMin.data).toEqual(mockResponse.min);
		expect(component.producerWinIntervalDataMin.data).toEqual(mockResponse.max);
	});

	it('should fetch movie winners by year when year input changes', fakeAsync(() => {
		const moviesService = TestBed.inject(MoviesService);
		const mockResponse = [{ id: 1, title: 'Movie A', year: 2000, studios: ['Studio A'], producers: ['Producer A'], winner: true }];

		spyOn(moviesService, 'getMovieWinnersByYear').and.returnValue(of(mockResponse));

		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		fixture.detectChanges(); // Trigger ngOnInit to set up subscriptions

		component.onYearInputChange(2000);
		tick(500); // Ensure debounce time is simulated
		fixture.detectChanges(); // Trigger change detection after data should be fetched

		expect(moviesService.getMovieWinnersByYear).toHaveBeenCalledWith(2000);
		expect(component.movieWinnersByYearData.data).toEqual(mockResponse);
	}));

	it('should debounce year input changes', fakeAsync(() => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		const moviesService = TestBed.inject(MoviesService);
		const mockResponse = [{ id: 1, title: 'Movie A', year: 2000, studios: ['Studio A'], producers: ['Producer A'], winner: true }];

		spyOn(moviesService, 'getMovieWinnersByYear').and.returnValue(of(mockResponse));

		fixture.detectChanges(); // Initialize component and subscriptions

		component.onYearInputChange(2000);
		tick(500); // Simulate debounce time

		expect(moviesService.getMovieWinnersByYear).toHaveBeenCalledWith(2000);
		expect(component.movieWinnersByYearData.data).toEqual(mockResponse);
	}));

	it('should clean up subscriptions on destroy', () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const component = fixture.componentInstance;
		spyOn(component['destroy$'], 'next');
		spyOn(component['destroy$'], 'complete');

		component.ngOnDestroy();

		expect(component['destroy$'].next).toHaveBeenCalled();
		expect(component['destroy$'].complete).toHaveBeenCalled();
	});
});
