import { Stack } from '@mui/material';

import KeyboardButton from './KeyboardButton';

const simulateKeyPress = (key: string) => {
	const keydownEvent = new KeyboardEvent('keydown', { key });
	console.log(keydownEvent);
	console.log(`letter ${key} guessed`);
	// have to emit the event somehow
	window.dispatchEvent(new KeyboardEvent('keydown', { key }));
};

const Keyboard = () => (
	<Stack sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
		<Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
			{['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(key => (
				<KeyboardButton
					key={key}
					name={key}
					keyPressAction={() => simulateKeyPress(key)}
				/>
			))}
		</Stack>
		<Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
			{['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(key => (
				<KeyboardButton
					key={key}
					name={key}
					keyPressAction={() => simulateKeyPress(key)}
				/>
			))}
		</Stack>
		<Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
			{['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(key => (
				<KeyboardButton
					key={key}
					name={key}
					keyPressAction={() => simulateKeyPress(key)}
				/>
			))}
		</Stack>
	</Stack>
);

export default Keyboard;
