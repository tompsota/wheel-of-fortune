import { User } from 'firebase/auth';

import GameRound from './GameRound';
import GameSettings from './GameSettings';

type Game = {
	id?: string;
	playerId: User['uid'] | null;
	status: 'Finished' | 'InProgress';
	score: number;
	rounds: GameRound[];
	settings: GameSettings;
	startedAt: Date;
};

export default Game;
