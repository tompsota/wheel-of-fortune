import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import useGame from '../hooks/useGame';
import { getCurrentRound } from '../utils/game';

import KeyboardButton from './KeyboardButton';

const simulateKeyPress = (key: string) => {
	document.dispatchEvent(new KeyboardEvent('keydown', { key }));
};

const Keyboard = () => {
	console.log('keyboard rendered');

	const game = useGame();
	const round = getCurrentRound(game);

	// const [rround, setRound] = useState<GameRound>();

	// const [letters, setLetters] = useState<string[]>(round.guessedLetters);

	// useEffect(() => {
	// 	console.log('KEYBOARD: round.guessedLetters useEffect');
	// 	setLetters(round.guessedLetters);
	// }, [round.guessedLetters]);

	// useEffect(() => {
	// 	console.log('KEYBOARD: round useEffect');
	// }, [round]);

	// useEffect(() => {
	// 	console.log('KEYBOARD: game useEffect');
	// 	const rrround = getCurrentRound(game);
	// 	setLetters(rrround.guessedLetters);
	// }, [game]);

	const createKeyboardButton = (key: string) => (
		<KeyboardButton
			key={key}
			name={key}
			// isDisabled={letters.includes(key)}
			keyPressAction={() => simulateKeyPress(key)}
		/>
	);

	return (
		<Stack sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
			<Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
				{['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(
					createKeyboardButton
				)}
			</Stack>
			<Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
				{['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(
					createKeyboardButton
				)}
			</Stack>
			<Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
				{['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(createKeyboardButton)}
			</Stack>
		</Stack>
	);
};

export default Keyboard;
