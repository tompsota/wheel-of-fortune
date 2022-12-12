import { Timestamp } from 'firebase/firestore';

import Board from './Board';

type GameRound = {
	board: Board;
	roundNumber: number;
	status: 'Pass' | 'Fail' | 'BeforeInit' | 'InProgress';
	score: number;
	phrase: string;
	guessedLetters: string[];
	// duration: Timestamp;
	// startedAt: Timestamp;
	// finishedAt: Timestamp; // since game can be paused (soon TM), this can't be used to calculate duration)
	// TODO: have to change ideally to null, since can't save undefined to DB
	guessesLeft?: number; // if we decide to add game settings
	timeLeftOnTimer?: number; // if we decide to add game settings
};

export default GameRound;
