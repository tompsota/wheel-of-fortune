import { Box, Grid, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

import { BoardTile } from '../types/Board';

type Props = {
	tile: BoardTile;
};

// rename one of the Tiles to 'BoardTile' ?
const Tile: FC<Props> = ({ tile }) => {
	const theme = useTheme();

	// empty/blank tile
	if (tile.value === undefined || tile.value === ' ') {
		return (
			<Box
				sx={{
					m: 1,
					fontSize: '1vw',
					width: '3.2vw',
					height: '3.2vw',
					borderRadius: '0.25rem',
					border: `0.5px solid ${theme.palette.secondary.dark}`
				}}
			/>
		);
	}

	// hidden tile with letter
	if (tile.hidden) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					m: 1,
					fontSize: '1vw',
					width: '3.2vw',
					height: '3.2vw',
					borderRadius: '0.25rem',
					border: `0.5px solid ${theme.palette.secondary.light}`
				}}
			>
				<Typography fontSize="1.2vw">?</Typography>
			</Box>
		);
	}

	// uncovered tile, i.e. letter
	return (
		<Grid
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				m: 1,
				fontSize: '1vw',
				width: '3.2vw',
				height: '3.2vw',
				borderRadius: '0.25rem',
				border: `0.5px solid ${theme.palette.secondary.main}`
			}}
		>
			<Typography
				color={theme.palette.secondary.light}
				textTransform="uppercase"
				fontSize="1.5vw"
			>
				{tile.value}
			</Typography>
		</Grid>
	);
};

export default Tile;
