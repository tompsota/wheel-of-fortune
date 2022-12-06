import { Grid, useTheme } from '@mui/material';
import { FC } from 'react';

import { BoardTile } from '../types/Board';

type Props = {
	tile: BoardTile;
};

// rename one of the Tiles to 'BoardTile' ?
const Tile: FC<Props> = ({ tile }) => {
	const theme = useTheme();

	// empty/blank tile
	if (tile.value === undefined) {
		return (
			<Grid
				sx={{
					m: 1,
					fontSize: '1vw',
					width: '3.2vw',
					height: '3.2vw',
					borderRadius: '0.25rem',
					border: `0.5px solid ${theme.palette.secondary.main}`
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
					borderRadius: '0.25rem',
					border: `0.5px solid ${theme.palette.secondary.main}`
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
				borderRadius: '0.25rem',
				border: `0.5px solid ${theme.palette.secondary.main}`,
				textAlign: 'center'
			}}
		>
			{tile.value}
		</Grid>
	);
};

export default Tile;
