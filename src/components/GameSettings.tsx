import { ExpandLess, ExpandMore, Settings } from '@mui/icons-material';
import {
	Box,
	Collapse,
	Divider,
	IconButton,
	Stack,
	Typography,
	useTheme
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC, useState } from 'react';

import { useGameSettingsContext } from '../hooks/useGameSettings';
import { useGameContext } from '../hooks/useGameTest';
import { endGame } from '../utils/game';
import GameSettingsType from '../types/GameSettings';

import GameSettingsItem from './GameSettingsItem';

const GameSettings: FC = () => {
	const [gameSettings, setGameSettings] = useGameSettingsContext();
	const [settingsOpen, setSettingsOpen] = useState(true);
	const { enqueueSnackbar } = useSnackbar();
	const theme = useTheme();
	const [game, setGame] = useGameContext();

	const settingsChangedHelper = (newSettings: GameSettingsType) => {
		setGameSettings(newSettings);
		localStorage.setItem('gamesettings', JSON.stringify(newSettings));

		if (game !== undefined) {
			// TODO: probably change text 'Settings have been updated.' or something,
			//       inform user that his game will end if he changes settings (?) - outside of this snackbar
			enqueueSnackbar(
				'Your old game has been submitted. New game will have these settings.'
			);
		}
		endGame(game, setGame);
	};

	const onNumberOfGuessesChanged = (
		_e: Event,
		value: number | number[],
		_a: number
	) => {
		if (Array.isArray(value)) {
			value = value[0];
		}
		const numberOfGuesses = value === 0 ? undefined : value;
		const newSettings = { ...gameSettings, numberOfGuesses };
		settingsChangedHelper(newSettings);
		// enqueueSnackbar("Updated settings won't be applied to the current game.");
	};

	const onTimerChanged = (_e: Event, value: number | number[], _a: number) => {
		if (Array.isArray(value)) {
			value = value[0];
		}
		const timer = value === 0 ? undefined : value; // timer is saved in minutes
		const newSettings = { ...gameSettings, timer };
		settingsChangedHelper(newSettings);
	};

	const handleSettingsOpen = () => {
		setSettingsOpen(o => !o);
	};

	return (
		<Stack
			sx={{
				background: theme.palette.backgroundLight,
				borderRadius: '0.5rem'
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					py: '0.5rem',
					px: '2rem',
					background: theme.palette.backgroundDarker
				}}
			>
				<Box sx={{ display: 'flex', paddingLeft: '0' }}>
					<Settings sx={{ alignSelf: 'center' }} />
					<Typography
						sx={{ fontWeight: 'bold', alignSelf: 'center', pl: '1rem' }}
					>
						Settings
					</Typography>
				</Box>
				<IconButton onClick={handleSettingsOpen}>
					{settingsOpen ? <ExpandLess /> : <ExpandMore />}
				</IconButton>
			</Box>

			<Collapse in={settingsOpen} timeout="auto" unmountOnExit>
				<GameSettingsItem
					label="Number of guesses"
					value={
						gameSettings.numberOfGuesses === undefined
							? 0
							: gameSettings.numberOfGuesses
					}
					onChange={onNumberOfGuessesChanged}
					options={[
						{
							value: 0,
							label: 'Unlimited'
						},
						{
							value: 3,
							label: '3'
						},
						{
							value: 5,
							label: '5'
						},
						{
							value: 10,
							label: '10'
						}
					]}
				/>
				<Divider />
				<GameSettingsItem
					label="Round timer"
					value={gameSettings.timer === undefined ? 0 : gameSettings.timer}
					onChange={onTimerChanged}
					options={[
						{
							value: 0,
							label: 'Unlimited'
						},
						{
							value: 1,
							label: '1'
						},
						{
							value: 3,
							label: '3'
						},
						{
							value: 5,
							label: '5'
						}
					]}
				/>
			</Collapse>
		</Stack>
	);
};

export default GameSettings;
