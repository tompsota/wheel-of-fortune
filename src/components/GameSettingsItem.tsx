import { Slider, Stack, Typography } from '@mui/material';
import { FC } from 'react';

// type Props<T> = {
type Props = {
	value: number;
	label: string;
	options: {
		value: number;
		label: string;
	}[];
	onChange: (
		event: Event,
		value: number | number[],
		activeThumb: number
	) => void;
};

const GameSettingsItem: FC<Props> = ({ value, label, options, onChange }) => {
	const valueLabelFormat = (value: number) =>
		value === 0 ? 'Unlimited' : value;

	return (
		<Stack sx={{ display: 'flex', padding: '2rem' }}>
			<Typography>{label}</Typography>
			<Slider
				defaultValue={value}
				max={10}
				valueLabelFormat={valueLabelFormat}
				step={null}
				valueLabelDisplay="auto"
				marks={options}
				onChange={onChange}
				sx={{
					margin: '2rem',
					width: 'unset'
				}}
			/>
		</Stack>
	);
};

export default GameSettingsItem;
