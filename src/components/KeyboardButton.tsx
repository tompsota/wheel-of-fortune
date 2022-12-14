import { Button, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

import useGame from '../hooks/useGame';
import { getCurrentRound } from '../utils/game';

type Props = {
	name: string;
	keyPressAction: () => void;
};

const KeyboardButton = ({ name, keyPressAction }: Props) => {
	const theme = useTheme();

	const [disabled, setDisabled] = useState(false);

	const game = useGame();

	useEffect(() => {
		const round = getCurrentRound(game);
		setDisabled(round.guessedLetters.includes(name));
	}, [game]);

	return (
		<Button
			variant="outlined"
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
