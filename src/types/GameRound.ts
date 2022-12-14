import Board from './Board';

type GameRound = {
	board: Board;
	roundNumber: number;
	status: 'Pass' | 'Fail' | 'BeforeInit' | 'InProgress';
	score: number;
	phrase: string;
	phraseAuthor: string;
	guessedLetters: string[];
	startedAt: Date;
	guessesLeft: number | null;
	timeLeftOnTimer: number | null;
};

export default GameRound;
