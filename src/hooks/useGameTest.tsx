import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from 'react';

import Game from '../types/Game';
import GameRound from '../types/GameRound';
import { getEmptyGame, getEmptyRound } from '../utils/game';

type GameState = [Game | undefined, Dispatch<SetStateAction<Game | undefined>>];
const GameContext = createContext<GameState>(undefined as never);

// Wrapped context provider
export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
	const localStorageGameString = localStorage.getItem('game');
	// We load (paused) game from local storage, or create a new game
	const game =
		localStorageGameString === null
			? undefined
			: (JSON.parse(localStorageGameString) as Game);

	const gameState = useState<Game | undefined>(game);

	useEffect(() => {
		// if something should be done once upon mounting GameProvider component
	}, []);

	return (
		<GameContext.Provider value={gameState}>{children}</GameContext.Provider>
	);
};

export const useGame = () => {
	const [game, _] = useContext(GameContext);
	return game;
};

export const useGameContext = (): [
	Game | undefined,
	Dispatch<SetStateAction<Game | undefined>>
] => {
	const [game, setGame] = useContext(GameContext);
	return [game, setGame];
};

// export const useGameBoard = () => {
// 	const [game, _] = useContext(GameContext);
// 	return [game.board, setBoard];
// };

// export const setBoard = () => (boardState: BoardState) => {
// 	const [game, setGame] = useContext(GameContext);
// 	setGame({ ...game, board: boardState });
// };

// export const useGamePhrase = () => {
// 	const [game, _] = useContext(GameContext);
// 	return [game.phrase, setPhrase];
// };

// export const setPhrase = () => (phrase: string) => {
// 	const [game, setGame] = useContext(GameContext);
// 	setGame({ ...game, phrase });
// };

// const setRounds = (rounds: GameRound[]) => {
// 	const [game, setGame] = useContext(GameContext);
// 	if (game !== undefined) {
// 		setGame({ ...game, rounds });
// 	}
// };

// export const setCurrentRound = (round: GameRound) => {
// 	const [game, setGame] = useContext(GameContext);
// 	setGame({ ...game, rounds: [...game.rounds.slice(0, -1), round] });
// };

// export const getCurrentRound = (): GameRound =>
// 	getGame().rounds.at(-1) ?? getEmptyRound();

// export const useCurrentRound = (): [GameRound, (round: GameRound) => void] => [
// 	getCurrentRound(),
// 	setCurrentRound
// ];

// export const addRound = (round: GameRound) => {
// 	const game = useGame();
// 	setRounds([...game.rounds, round]);
// };

export const addRoundGame = (game: Game, round?: GameRound): Game => {
	const newRound =
		round ?? getEmptyRound(game.rounds.length + 1, game.settings);
	return {
		...game,
		rounds: [...game.rounds, newRound]
	};
};

export const updateCurrentRoundGame = (game: Game, round: GameRound): Game => ({
	...game,
	rounds: [...game.rounds.slice(0, -1), round]
});

export default useGame;
