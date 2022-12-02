import { Grid } from '@mui/material';
import { FC } from 'react';

import { BoardStateTile } from '../hooks/useGame';

type Props = {
	tile: BoardStateTile;
};

// rename one of the Tiles to 'BoardTile' ?
const Tile: FC<Props> = ({ tile }) => {
	// empty/blank tile
	if (tile.value === undefined) {
		return (
			<Grid
				sx={{
					m: 1,
					fontSize: 25,
					width: 90,
					height: 90,
					border: '1px solid blue'
				}}
			/>
		);
	}

	// hidden tile with letter
	if (tile.hidden) {
		return (
			<Grid
				sx={{
					m: 1,
					fontSize: 25,
					width: 90,
					height: 90,
					border: '1px solid blue'
				}}
			>
				?
			</Grid>
		);
	}

	// uncovered tile, i.e. letter
	return (
		<Grid
			sx={{
				m: 1,
				fontSize: 25,
				width: 90,
				height: 90,
				border: '1px solid blue',
				textAlign: 'center'
			}}
		>
			{tile.value}
		</Grid>
	);
};

export default Tile;
