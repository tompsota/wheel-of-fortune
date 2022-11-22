import { Button } from '@mui/material';

type Props = {
	name: string;
	keyPressAction: () => void;
};

const KeyboardButton = ({ name, keyPressAction }: Props) => (
	<Button
		variant="outlined"
		onClick={keyPressAction}
		size="large"
		sx={{ m: 1, fontSize: 25, width: 90, height: 90 }}
	>
		{name}
	</Button>
);

export default KeyboardButton;
