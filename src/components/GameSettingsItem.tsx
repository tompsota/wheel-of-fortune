import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent
} from '@mui/material';
import { FC } from 'react';

// type Props<T> = {
type Props = {
	value: string;
	label: string;
	options: Record<string, string>;
	onChange: (event: SelectChangeEvent) => void;
};

const GameSettingsItem: FC<Props> = ({ value, label, options, onChange }) => (
	// const GameSettingsItem = <T,>({ value, label, options, onChange }: Props<T>) => (

	<FormControl fullWidth>
		<InputLabel id={label}>{label}</InputLabel>
		<Select
			labelId={label}
			id={label}
			value={value}
			label={label}
			onChange={onChange}
		>
			{Object.entries(options).map((option, i) => (
				<MenuItem key={i} value={option[1]}>
					{option[0]}
				</MenuItem>
			))}
		</Select>
	</FormControl>
);

export default GameSettingsItem;
