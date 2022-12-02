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

import { BoardState } from './useGame';

export type Game = {
	board: BoardState;
	phrase: string;
	guessesLeft: number;
	guessedLetters: string[];
};

type GameState = [Game, Dispatch<SetStateAction<Game>>];
const GameContext = createContext<GameState>(undefined as never);

// where to do initialization of phrase/board ?
const getInitGame = (): Game => ({
	board: [],
	phrase: '',
	guessesLeft: 5,
	guessedLetters: []
});

// Wrapped context provider
export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
	const gameState = useState<Game>(getInitGame());

	useEffect(() => {
		// if something should be done once upon mounting GameProvider component
	}, []);

	return (
		<GameContext.Provider value={gameState}>{children}</GameContext.Provider>
	);
};

export const useGame = () => {
	const [game, setGame] = useContext(GameContext);
	return [game, setGame];
};

export const useGameBoard = () => {
	const [game, _] = useContext(GameContext);
	return [game.board, setBoard];
};

export const setBoard = () => (boardState: BoardState) => {
	const [game, setGame] = useContext(GameContext);
	setGame({ ...game, board: boardState });
};

export const useGamePhrase = () => {
	const [game, _] = useContext(GameContext);
	return [game.phrase, setPhrase];
};

export const setPhrase = () => (phrase: string) => {
	const [game, setGame] = useContext(GameContext);
	setGame({ ...game, phrase });
};

export default useGame;
