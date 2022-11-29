import { FC } from 'react';
import { Grid } from '@mui/material';

import useGame from '../hooks/useGame';

import Tile from './Tile';

const Board: FC = () => {
	const { board, phrase, onLetterGuessed, onRefresh } = useGame();
	// const rows =

	// here, we would like to have a list of rows, where row is a list of tiles
	// problem: it's much easier to work with flat/1D array,
	//   but for displaying, we want 2D array
	// transform phrase directly into 2D array, and just work with it
	// or work with 1D array and create a function, that returns 2D array from 1D array ?
	return (
		<Grid container spacing={1}>
			{board.map((field, i) => (
				<Tile key={i} field={field} />
			))}
		</Grid>
	);
};

export default Board;
