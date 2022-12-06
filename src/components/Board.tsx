import { FC, useEffect } from 'react';
import { Stack, Typography, useTheme } from '@mui/material';

// import useGame from '../hooks/useGame';

import BoardState, { BoardRow } from '../types/Board';
import { useCurrentRound } from '../hooks/useGameTest';

import Tile from './Tile';

type Props = {
	board: BoardState;
};

const Board: FC<Props> = ({ board }) => {
	// const [round, setRound] = useCurrentRound();

	// useEffect(() => {
	// 	if (round.status !== 'BeforeInit') {
	// 		return;
	// 	}
	// 	// setPhrase();
	// }, []);

	// const { board, phrase, onLetterGuessed } = useGame();
	const theme = useTheme();

	const boardRow = (row: BoardRow, i: number) => (
		<Stack
			key={i}
			direction="row"
			sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}
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
		<Stack
			sx={{
				display: 'flex',
				justifyContent: 'center',
				height: '100%'
			}}
		>
			<Typography>Your sentence:</Typography>
			<Stack
				sx={{
					backgroundColor: theme.palette.backgroundLight,
					borderRadius: '0.25rem',
					padding: '1rem',
					margin: '1rem'
				}}
			>
				{board.map(boardRow)}
			</Stack>
			<Typography variant="caption" sx={{ alignSelf: 'flex-end' }}>
				sentence author
			</Typography>
		</Stack>

		// <Grid container spacing={1}>
		// 	{board.map((field, i) => (
		// 		<Tile key={i} field={field} />
		// 	))}
		// </Grid>
	);
};

export default Board;
