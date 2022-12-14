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

export const GameSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
	console.log('GameSettings Provider - render');

	const defaultSettings = {
		timer: null,
		numberOfGuesses: null
	} as GameSettings;

	const localStorageGameString = localStorage.getItem('gamesettings');
	// we load game settings from local storage, later they can be set according
	// to a game in progress, if such a game exists
	const gameSettings =
		localStorageGameString === null
			? defaultSettings
			: (JSON.parse(localStorageGameString) as GameSettings);

	const gameSettingsState = useState<GameSettings>(gameSettings);

	// TODO: remove useEffect
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
