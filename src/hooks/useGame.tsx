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
import { getPlayersGameInProgressAsync, upsertGameDB } from '../utils/firebase';
import { getEmptyRoundAsync } from '../utils/game';

import { useGameSettingsContext } from './useGameSettings';
import useLoggedInUser from './useLoggedInUser';

type GameState = [Game | undefined, Dispatch<SetStateAction<Game | undefined>>];
const GameContext = createContext<GameState>(undefined as never);

export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
	const user = useLoggedInUser();
	const [_, setGameSettings] = useGameSettingsContext();

	const gameState = useState<Game | undefined>();
	const [game, setGame] = gameState;

	useEffect(() => {
		(async () => {
			const currentGame = await getPlayersGameInProgressAsync(user?.id);
			setGame(currentGame);
			if (currentGame !== undefined) {
				setGameSettings(currentGame?.settings);
			}
		})();

		const listener = (_e: Event) => {
			if (game !== undefined) {
				upsertGameDB(game);
			}
		};

		window.addEventListener('beforeunload', listener);

		// save the game on unmount, to prevent possible cheating by closing the game,
		// since the game in DB only updates upon every finished round:
		// - too many wrong guesses / low on timer / difficult phrase => close game => start fresh new round
		// .. or to save a game before player has finished a single round
		return () => {
			if (game !== undefined) {
				upsertGameDB(game);
			}
			window.removeEventListener('beforeunload', listener);
		};
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
