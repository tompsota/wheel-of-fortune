import GameRound from '../types/GameRound';

import BoardDto from './BoardDto';

type GameRoundDto = Omit<GameRound, 'board'> & { board: BoardDto };

export default GameRoundDto;
