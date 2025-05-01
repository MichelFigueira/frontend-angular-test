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
