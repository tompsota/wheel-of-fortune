import Game from './Game';
import User from './User';

type GameWithPlayer = Omit<Game, 'playerId'> & { player: User | null };

export default GameWithPlayer;
