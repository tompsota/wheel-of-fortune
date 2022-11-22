import { Button, Stack } from '@mui/material';

const Keyboard = () => (
	<>
		<Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
			{['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(key => (
				<Button key={key}>{key}</Button>
			))}
		</Stack>
		<Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
			{['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(key => (
				<Button key={key}>{key}</Button>
			))}
		</Stack>
		<Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
			{['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(key => (
				<Button key={key}>{key}</Button>
			))}
		</Stack>
	</>
);

export default Keyboard;
