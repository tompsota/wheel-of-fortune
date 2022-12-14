// export type NumberOfGuessesOptions = undefined | 3 | 5 | 10;
// export type TimerOptions = undefined | 60 | 180 | 300;

type GameSettings = {
	numberOfGuesses: number | null;
	timer: number | null;
};

export default GameSettings;
