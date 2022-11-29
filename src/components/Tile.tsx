import { Grid } from '@mui/material';
import { FC } from 'react';

import { Tile } from '../hooks/useGame';

type Props = {
	field: Tile;
};

const Tile: FC<Props> = ({ field }) => {
	const _tmp = 0;
	return field.hidden || field.value === undefined ? (
		<Grid>empty tile</Grid>
	) : (
		<Grid>{field.value}</Grid>
	);
};

export default Tile;
