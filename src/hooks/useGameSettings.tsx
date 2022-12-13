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
	console.log('GameSettings Provider - render');

	const defaultSettings = {
		timer: null,
		numberOfGuesses: null
	} as GameSettings;

	const localStorageGameString = localStorage.getItem('gamesettings');
	// We load (paused) game from local storage, or create a new game
	const gameSettings =
		localStorageGameString === null
			? defaultSettings
			: (JSON.parse(localStorageGameString) as GameSettings);

	const gameSettingsState = useState<GameSettings>(gameSettings);

	useEffect(() => {
		console.log('GameSettings Provider - on mount');
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
