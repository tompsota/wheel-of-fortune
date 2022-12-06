import { Stack } from '@mui/material';

import KeyboardButton from './KeyboardButton';

const simulateKeyPress = (key: string) => {
	document.dispatchEvent(new KeyboardEvent('keydown', { key }));
};

// type KeyboardButtonState = Record<string, boolean>;
// type KeyboardRowState = KeyboardButtonState[];
// type KeyboardState = KeyboardRowState[];

// // vzdy vynulovat stav, ked pribudne nove kolo (game.rounds.length)
// const getInitKeyboard = (): KeyboardState => {

// }

// const getUpdatedKeyboard = (keyboard: KeyboardState, key: string): KeyboardState => {
//   // return keyboard, where given key has value (for disabled) set to true
// }

// const listener = (e: KeyboardEvent) => {
//   if (isAlpha(e.key)) {
//     setKeyboard(getUpdatedKeyboard(keyboard, e.key));
//   }
// }

// const KeyboardRow = (rowLetters: ) => (
//   <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
//     {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(key => (
//       <KeyboardButton
//         key={key}
//         name={key}
//         keyPressAction={() => simulateKeyPress(key)}
//       />
//     ))}
//   </Stack>
// )

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
