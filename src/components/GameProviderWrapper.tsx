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
import {
	getPlayersGameInProgress,
	getPlayersGameInProgressAsync
} from '../utils/firebase';

type GameState = [Game | undefined, Dispatch<SetStateAction<Game | undefined>>];
const GameContextWrapper = createContext<GameState>(undefined as never);

// itself, since that would fetch from DB on every setGame (game update)
export const GameProviderWrapperTest: FC<PropsWithChildren> = ({
	children
}) => {
	const user = useLoggedInUser();
	const [_, setGameSettings] = useGameSettingsContext();
	const game = getPlayersGameInProgress(user?.id);

	const gameState = useState<Game | undefined>(game);
	const [_game, setGame] = gameState;

	useEffect(() => {
		if (game !== undefined) {
			setGameSettings(game.settings);
		}
	}, []);

	useEffect(() => {
		if (game !== undefined && _game === undefined) {
			setGame(game);
		}
	}, [game]);

	return (
		<GameContextWrapper.Provider value={gameState}>
			{children}
		</GameContextWrapper.Provider>
	);
};

export const GameProviderWrapper: FC<PropsWithChildren> = ({ children }) => {
	const user = useLoggedInUser();
	const [_, setGameSettings] = useGameSettingsContext();

	const gameState = useState<Game | undefined>();
	const [_game, setGame] = gameState;

	useEffect(() => {
		(async () => {
			const game = await getPlayersGameInProgressAsync(user?.id);
			setGame(game);
			if (game !== undefined) {
				setGameSettings(game?.settings);
			}
		})();
	}, []);

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
