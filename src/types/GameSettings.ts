export type NumberOfGuessesOptions = undefined | 3 | 5 | 10;
export type TimerOptions = undefined | 60 | 180 | 300;

type GameSettings = {
	// numberOfGuesses?: NumberOfGuessesOptions;
	// timer?: TimerOptions;
	numberOfGuesses?: number;
	timer?: number;
};

export default GameSettings;
