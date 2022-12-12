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

import GameSettings from '../types/GameSettings';

type GameSettingsState = [GameSettings, Dispatch<SetStateAction<GameSettings>>];
const GameSettingsContext = createContext<GameSettingsState>(
	undefined as never
);

// Wrapped context provider
export const GameSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
	const localStorageGameString = localStorage.getItem('gamesettings');
	// We load (paused) game from local storage, or create a new game
	const gameSettings =
		localStorageGameString === null
			? {}
			: (JSON.parse(localStorageGameString) as GameSettings);

	const gameSettingsState = useState<GameSettings>(gameSettings);

	useEffect(() => {
		// if something should be done once upon mounting GameProvider component
	}, []);

	return (
		<GameSettingsContext.Provider value={gameSettingsState}>
			{children}
		</GameSettingsContext.Provider>
	);
};

export const useGameSettings = () => {
	const [settings, _] = useContext(GameSettingsContext);
	return settings;
};

export const useGameSettingsContext = (): [
	GameSettings,
	Dispatch<SetStateAction<GameSettings>>
] => useContext(GameSettingsContext);
