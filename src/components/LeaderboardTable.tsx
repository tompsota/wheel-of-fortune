import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import GameWithPlayer from '../types/GameWithPlayer';
import { getGameMode } from '../utils/game';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14
	}
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.backgroundLight
	},
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.backgroundDarker
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0
	}
}));

type Props = {
	games: GameWithPlayer[];
};

const LeaderboardTable: React.FC<Props> = ({ games }) => (
	<TableContainer component={Paper}>
		<Table sx={{ minWidth: 200 }} aria-label="customized table">
			<TableHead>
				<TableRow>
					<StyledTableCell />
					<StyledTableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
						Player
					</StyledTableCell>
					<StyledTableCell
						align="center"
						sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
					>
						Points total
					</StyledTableCell>
					<StyledTableCell
						align="center"
						sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
					>
						Mode
					</StyledTableCell>
					<StyledTableCell
						align="center"
						sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
					>
						Date
					</StyledTableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{games.map((game, idx) => (
					<StyledTableRow key={game.id ?? idx.toString()}>
						<StyledTableCell align="center" sx={{ fontWeight: 'bold' }}>
							{idx + 1}
						</StyledTableCell>
						<StyledTableCell component="th" scope="row">
							{game.player?.nickname ?? 'Anonymous guest'}
						</StyledTableCell>
						<StyledTableCell align="center">{game.score}</StyledTableCell>
						<StyledTableCell align="center">
							{getGameMode(game)}
						</StyledTableCell>
						<StyledTableCell align="center">
							{new Date(
								Number(game.startedAt.toString().substring(18, 28)) * 1000
							).toLocaleString('sk-SK')}
						</StyledTableCell>
					</StyledTableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
);

export default LeaderboardTable;
