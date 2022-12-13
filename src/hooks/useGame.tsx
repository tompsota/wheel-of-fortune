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

import { useGameInProgress } from '../components/GameProviderWrapper';
import Game from '../types/Game';
import GameRound from '../types/GameRound';
import {
	getPlayersGameInProgress,
	getPlayersGameInProgressAsync,
	getPlayersGameInProgressTest,
	upsertGameDB
} from '../utils/firebase';
import { getEmptyGame, getEmptyRound, getEmptyRoundAsync } from '../utils/game';

import { useGameSettingsContext } from './useGameSettings';
import useLoggedInUser from './useLoggedInUser';

type GameState = [Game | undefined, Dispatch<SetStateAction<Game | undefined>>];
const GameContext = createContext<GameState>(undefined as never);

type Props = {
	game: Game | undefined;
} & PropsWithChildren;

export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
	console.log('GameProvider - render');

	const user = useLoggedInUser();
	const [_, setGameSettings] = useGameSettingsContext();
	// const game = getPlayersGameInProgress(user?.authUser.uid);

	const gameState = useState<Game | undefined>();
	const [game, setGame] = gameState;

	useEffect(() => {
		console.log('GameProvider - on mount');
		(async () => {
			// console.log(`GameProvider - on mount - userId: ${user?.id}`);
			const currentGame = await getPlayersGameInProgressAsync(user?.id);
			console.log(`GameProvider - on mount - game: ${game}`);
			setGame(currentGame);
			if (currentGame !== undefined) {
				setGameSettings(currentGame?.settings);
			}
		})();

		const listener = (_e: Event) => {
			console.log('onbeforeunload triggered');
			if (game !== undefined) {
				console.log(`onbeforeunload triggered - update game: ${game}`);
				upsertGameDB(game, setGame);
			}
		};

		window.addEventListener('beforeunload', listener);

		// save the game on unmount, to prevent possible cheating by closing the game,
		// since the game in DB only updates upon every finished round:
		// - too many wrong guesses / low on timer / difficult phrase => close game => start fresh new round
		// .. or to save a game before player has finished a single round
		return () => {
			if (game !== undefined) {
				console.log(`unmount GameProvider - update game: ${game}`);
				upsertGameDB(game, setGame);
				setGame(game);
			}
			window.removeEventListener('beforeunload', listener);
		};
	}, []);

	return (
		<GameContext.Provider value={gameState}>{children}</GameContext.Provider>
	);
};

// Wrapped context provider
export const GameProviderOld: FC<PropsWithChildren> = ({ children }) => {
	// const localStorageGameString = localStorage.getItem('game');
	// We load (paused) game from local storage, or create a new game
	// const game =
	// 	localStorageGameString === null
	// 		? undefined
	// 		: (JSON.parse(localStorageGameString) as Game);

	// console.log('GameProvider - render');

	// const user = useLoggedInUser();
	// const [_gameSettings, setGameSettings] = useGameSettingsContext();
	// const game = getPlayersGameInProgress(user?.uid);
	const gameInProgress = useGameInProgress();

	console.log(`GameProvider - game: ${JSON.stringify(gameInProgress)}`);

	const initialGame =
		gameInProgress?.status === 'Finished' ? undefined : gameInProgress;
	const gameState = useState<Game | undefined>(initialGame);
	// const gameState = useState<Game | undefined>(undefined);
	const [game, setGame] = gameState;

	// if (game !== undefined) {
	// 	setGameSettings(game.settings);
	// }

	useEffect(() => {
		// const lastGame =
		// 	user === undefined ? undefined : getPlayersGameInProgress(user.uid);
		// setGame(lastGame);
		// if (lastGame !== undefined) {
		// 	setGameSettings(lastGame.settings);
		// }
		// if something should be done once upon mounting GameProvider component

		const _tmp = 0;

		// const listener = (_e: Event) => {
		// 	console.log('onbeforeunload triggered');
		// 	if (game !== undefined) {
		// 		console.log(`onbeforeunload triggered - update game: ${game}`);
		// 		upsertGameDB(game, setGame);
		// 	}
		// };

		// window.addEventListener('beforeunload', listener);
		// return () => {
		// 	if (game !== undefined) {
		// 		console.log(`unmount GameProvider - update game: ${game}`);
		// 		upsertGameDB(game, setGame);
		// 		setGame(game);
		// 	}
		// 	window.removeEventListener('beforeunload', listener);
		// };

		// // save the game on unmount, to prevent possible cheating by closing the game,
		// // since the game in DB only updates upon every finished round:
		// // - too many wrong guesses / low on timer / difficult phrase => close game => start fresh new round
		// // .. or to save a game before player has finished a single round
		// return () => {
		// 	if (game !== undefined) {
		// 		upsertGameDB(game, setGame);
		// 	}
		// };
	}, []);

	//
	//
	// the last player's game gets fetched correctly (renders twice with undefined value,
	// third time returns the correct game), BUT the state itself doesn't get updated???
	// ... i.e. the game from GameContext is still undefined (for Play, AppLayout etc.),
	// ... but adding this hook fixes it :DDD
	// useEffect(() => {
	// 	console.log(`GameProvider - useEffect`);
	// 	if (
	// 		gameInProgress !== undefined &&
	// 		gameInProgress.status !== 'Finished' &&
	// 		game === undefined
	// 	) {
	// 		// console.log(`GameProvider - useEffect - setting game`);
	// 		console.log(`                        - setting game`);
	// 		setGame(gameInProgress);
	// 	}
	// }, [gameInProgress?.startedAt]);

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

export const addRoundGameAsync = async (
	game: Game,
	round?: GameRound
): Promise<Game> => {
	const newRound =
		round ?? (await getEmptyRoundAsync(game.rounds.length + 1, game.settings));
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
