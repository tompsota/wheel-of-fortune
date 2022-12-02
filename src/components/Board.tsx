import { FC } from 'react';
import { Stack } from '@mui/material';

import useGame, { BoardStateRow } from '../hooks/useGame';

import Tile from './Tile';

const Board: FC = () => {
	const { board, phrase, onLetterGuessed } = useGame();

	const boardRow = (row: BoardStateRow, i: number) => (
		<Stack
			key={i}
			direction="row"
			sx={{ display: 'flex', justifyContent: 'center' }}
		>
			{row.map((tile, j) => (
				<Tile key={j} tile={tile} />
			))}
		</Stack>
	);

	// here, we would like to have a list of rows, where row is a list of tiles
	// problem: it's much easier to work with flat/1D array,
	//   but for displaying, we want 2D array
	// transform phrase directly into 2D array, and just work with it
	// or work with 1D array and create a function, that returns 2D array from 1D array ?
	return (
		<Stack sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
			{board.map(boardRow)}
		</Stack>

		// <Grid container spacing={1}>
		// 	{board.map((field, i) => (
		// 		<Tile key={i} field={field} />
		// 	))}
		// </Grid>
	);
};

export default Board;
