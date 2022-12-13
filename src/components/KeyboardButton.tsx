import { Button, useTheme } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useRef } from 'react';

import useGame from '../hooks/useGame';
import { getCurrentRound, isAlpha } from '../utils/game';

type Props = {
	name: string;
	// isDisabled: boolean;
	keyPressAction: () => void;
};

const KeyboardButton = ({ name, keyPressAction }: Props) => {
	const { enqueueSnackbar } = useSnackbar();
	const theme = useTheme();

	const [disabled, setDisabled] = useState(false);
	// const inputRef = useRef<HTMLButtonElement | null>(null);

	const game = useGame();
	// const round = getCurrentRound(game);

	// // useEffect(() => {
	// // 	setDisabled(false);
	// // }, [game?.rounds.length]);

	// useEffect(() => {
	// 	setDisabled(round.guessedLetters.includes(name));
	// }, [round]);

	useEffect(() => {
		const round = getCurrentRound(game);
		setDisabled(round.guessedLetters.includes(name));
	}, [game]);

	// ideally don't want to add a new event listener for all keys?
	// could add a single event listener in Keyboard.tsx mount,
	// which handles KeyboardState (mainly has info about which keys are disabled) and passes this info
	// to each KeyboardButton (i.e. 'disabled' is also in Props),
	// and when the listeners is triggered (e.g. 't' was pressed), the keyboard state gets udpated -
	//  - the disabled value for letter 't' should now be set to 'true'
	//  - BUT if we use useState to keep the state of the board, we might have the same issue
	//    with EventListener as in Play.tsx (that the board didn't get updated / old state was being used)
	// useEffect(() => {
	// 	// all logic (adding/subtracting points, updating board etc.) is handled
	// 	// in the listeners registered inside Play.tsx)
	// 	const listener = (e: KeyboardEvent) => {
	// 		console.log(`keydown listener - Keyboard: ${JSON.stringify(e)}`);
	// 		// TODO: should prevent default? for all keys?
	// 		if (isAlpha(e.key)) {
	// 			e.preventDefault();
	// 		}
	// 		if (e.key === name) {
	// 			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// 			// @ts-ignore
	// 			// inputRef.current.click();
	// 			setDisabled(true);
	// 		}
	// 	};
	// 	document.addEventListener('keydown', listener);
	// 	return () => {
	// 		document.removeEventListener('keydown', listener);
	// 	};
	// }, []);

	return (
		<Button
			// ref={r => (inputRef.current = r)}
			variant="outlined"
			// onClick={() => {
			// 	const keydownEvent = new KeyboardEvent('keydown', { key: name });
			// 	console.log(`dispatched keydownevent: ${JSON.stringify(keydownEvent)}`);
			// 	document.dispatchEvent(keydownEvent);
			// 	// setDisabled(true);
			// 	// enqueueSnackbar(`+20 points for letter ${name}!`, {
			// 	// 	variant: 'info'
			// 	// });
			// 	// keyPressAction();
			// }}
			onClick={keyPressAction}
			size="large"
			disabled={disabled}
			sx={{
				m: 1,
				fontSize: '1.5vw',
				width: '4.5vw',
				height: '4.5vw',
				color: theme.palette.primary.light,
				borderColor: theme.palette.primary.light
			}}
		>
			{name}
		</Button>
	);
};

export default KeyboardButton;
