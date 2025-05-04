export interface MultipleWinnersYear {
	winnerCount: number;
	year: number;
}

export interface MultipleWinnersYearResponse {
	years: MultipleWinnersYear[];
}

export interface StudiosWinCount {
	name: string;
	winCount: number;
}

export interface StudiosWinCountResponse {
	studios: StudiosWinCount[];
}

export interface ProducerWinInterval {
	producer: string;
	interval: number;
	previousWin: number;
	followingWin: number;
}

export interface ProducerWinIntervalResponse {
	min: ProducerWinInterval[];
	max: ProducerWinInterval[];
}

export interface MovieWinnersByYearResponse {
	id: number;
	year: number;
	title: string;
	studios: string[];
	producers: string[];
	winner: boolean;
}

export interface MoviesResponse {
	content: MovieWinnersByYearResponse[];
	empty: boolean;
	first: boolean;
	last: boolean;
	number: number;
	numberOfElements: number;
	pageable: MoviesPageable;
	size: number;
	sort: MoviesSort;
	totalElements: number;
	totalPages: number;
}

export interface MoviesPageable {
	sort: MoviesSort;
	offset: number;
	pageSize: number;
	pageNumber: number;
	paged: boolean;
	unpaged: boolean;
}

export interface MoviesSort {
	sorted: boolean;
	unsorted: boolean;
	empty: boolean;
}
