import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

import GameRound from './GameRound';
import GameSettings from './GameSettings';

type Game = {
	// id: string;
	playerId: User['uid'];
	status: 'Finished' | 'Saved' | 'InProgress';
	score: number;
	rounds: GameRound[];
	settings: GameSettings;
	// duration: Timestamp;
	// startedAt: Timestamp;
	// finishedAt?: Timestamp;
};

export default Game;
