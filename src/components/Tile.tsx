import { Grid } from '@mui/material';
import { FC } from 'react';

import { BoardTile } from '../types/Board';

type Props = {
	tile: BoardTile;
};

// rename one of the Tiles to 'BoardTile' ?
const Tile: FC<Props> = ({ tile }) => {
	// empty/blank tile
	if (tile.value === undefined) {
		return (
			<Grid
				sx={{
					m: 1,
					fontSize: '1vw',
					width: '3.2vw',
					height: '3.2vw',
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
					fontSize: '1vw',
					width: '3.2vw',
					height: '3.2vw',
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
				fontSize: '1vw',
				width: '3.2vw',
				height: '3.2vw',
				border: '1px solid blue',
				textAlign: 'center'
			}}
		>
			{tile.value}
		</Grid>
	);
};

export default Tile;
