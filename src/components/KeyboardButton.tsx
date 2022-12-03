import { Button } from '@mui/material';
import { useState } from 'react';
import { useEffect, useRef } from 'react';

type Props = {
	name: string;
	keyPressAction: () => void;
};

const KeyboardButton = ({ name, keyPressAction }: Props) => {
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
				keyPressAction();
			}}
			size="large"
			disabled={disabled}
			sx={{ m: 1, fontSize: 25, width: 90, height: 90 }}
		>
			{name}
		</Button>
	);
};

export default KeyboardButton;
