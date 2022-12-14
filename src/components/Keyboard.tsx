import { Stack } from '@mui/material';

import KeyboardButton from './KeyboardButton';

const simulateKeyPress = (key: string) => {
	document.dispatchEvent(new KeyboardEvent('keydown', { key }));
};

const Keyboard = () => {
	const createKeyboardButton = (key: string) => (
		<KeyboardButton
			key={key}
			name={key}
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
