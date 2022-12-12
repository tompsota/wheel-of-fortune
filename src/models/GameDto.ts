import Game from '../types/Game';

import GameRoundDto from './GameRoundDto';

type GameDto = Omit<Game, 'rounds' | 'id'> & { rounds: GameRoundDto[] };

export default GameDto;
