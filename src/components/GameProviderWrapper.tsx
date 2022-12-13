// necessary, so that getPlayersGameInProgress() is not placed inside GameProvider

import {
	FC,
	PropsWithChildren,
	useState,
	useContext,
	createContext,
	Dispatch,
	SetStateAction,
	useEffect
} from 'react';

import { useGameSettingsContext } from '../hooks/useGameSettings';
import useLoggedInUser from '../hooks/useLoggedInUser';
import Game from '../types/Game';
import { getPlayersGameInProgress, upsertGameDB } from '../utils/firebase';

type GameState = [Game | undefined, Dispatch<SetStateAction<Game | undefined>>];
const GameContextWrapper = createContext<GameState>(undefined as never);

// itself, since that would fetch from DB on every setGame (game update)
export const GameProviderWrapper: FC<PropsWithChildren> = ({ children }) => {
	console.log(`GameProviderWRAPPER - render`);

	const user = useLoggedInUser();
	const [_, setGameSettings] = useGameSettingsContext();
	const game = getPlayersGameInProgress(user?.authUser.uid);

	const gameState = useState<Game | undefined>(game);
	const [_game, setGame] = gameState;

	useEffect(() => {
		if (game !== undefined) {
			setGameSettings(game.settings);
		}
	}, []);

	useEffect(() => {
		if (game !== undefined && _game === undefined) {
			console.log(`GameProviderWRAPPER - setting game`);
			setGame(game);
		}
		// setGame(game);
	}, [game]);

	return (
		<GameContextWrapper.Provider value={gameState}>
			{children}
		</GameContextWrapper.Provider>
	);
};

export const useGameInProgress = () => {
	const [game, _] = useContext(GameContextWrapper);
	return game;
};
