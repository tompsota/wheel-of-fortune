import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useEffect, useRef } from 'react';

type Props = {
	name: string;
	keyPressAction: () => void;
};

const KeyboardButton = ({ name, keyPressAction }: Props) => {
	const { enqueueSnackbar } = useSnackbar();

	const [disabled, setDisabled] = useState(false);
	const inputRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			e.preventDefault();
			if (e.key === name) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				inputRef.current.click();
			}
		};
		document.addEventListener('keydown', listener);
		return () => {
			document.removeEventListener('keydown', listener);
		};
	}, []);

	return (
		<Button
			ref={r => (inputRef.current = r)}
			variant="outlined"
			onClick={() => {
				setDisabled(true);
				enqueueSnackbar(`+20 points for letter ${name}!`, {
					variant: 'info'
				});
				keyPressAction();
			}}
			size="large"
			disabled={disabled}
			sx={{
				m: 1,
				fontSize: '1.5vw',
				width: '4.5vw',
				height: '4.5vw'
			}}
		>
			{name}
		</Button>
	);
};

export default KeyboardButton;
