import { Box, SelectChangeEvent } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC } from 'react';

import { useGameSettingsContext } from '../hooks/useGameSettings';

import GameSettingsItem from './GameSettingsItem';

const GameSettings: FC = () => {
	const [gameSettings, setGameSettings] = useGameSettingsContext();
	const { enqueueSnackbar } = useSnackbar();

	const onNumberOfGuessesChanged = (event: SelectChangeEvent) => {
		const value = event.target.value as string;
		const numberOfGuesses =
			value === 'unlimited'
				? undefined
				: parseInt(event.target.value as string);
		setGameSettings({ ...gameSettings, numberOfGuesses });
		enqueueSnackbar("Updated settings won't be applied to the current game.");
	};

	const onTimerChanged = (event: SelectChangeEvent) => {
		const value = event.target.value as string;
		const timer =
			value === 'unlimited'
				? undefined
				: parseInt(event.target.value as string);
		setGameSettings({ ...gameSettings, timer });
		enqueueSnackbar("Updated settings won't be applied to the current game.");
	};

	return (
		<Box>
			<GameSettingsItem
				label="Number of guesses"
				value={
					gameSettings.numberOfGuesses === undefined
						? 'unlimited'
						: gameSettings.numberOfGuesses?.toString()
				}
				onChange={onNumberOfGuessesChanged}
				options={{
					'no limit': 'unlimited',
					'3 guesses': '3',
					'5 guesses': '5',
					'10 guesses': '10'
				}}
			/>
			<GameSettingsItem
				label="Round timer"
				value={
					gameSettings.timer === undefined
						? 'unlimited'
						: gameSettings.timer?.toString()
				}
				onChange={onTimerChanged}
				options={{
					'no limit': 'unlimited',
					'1 minute': '60',
					'3 minutes': '180',
					'5 minutes': '300'
				}}
			/>
		</Box>
	);
};

export default GameSettings;
