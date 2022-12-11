import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

const createData = (
	name: string,
	totalPoints: number,
	mode: string,
	date: string
) => ({ name, totalPoints, mode, date });

const rows = [
	createData('Frozen yoghurt', 159, 'mode', Date.now().toLocaleString()),
	createData('Ice cream sandwich', 237, 'mode', Date.now().toLocaleString()),
	createData('Eclair', 262, 'mode', Date.now().toLocaleString()),
	createData('Cupcake', 305, 'mode', Date.now().toLocaleString()),
	createData('Gingerbread', 356, 'mode', Date.now().toLocaleString())
];

const LeaderboardTable = () => (
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
				{rows.map((row, idx) => (
					<StyledTableRow key={row.name}>
						<StyledTableCell align="center" sx={{ fontWeight: 'bold' }}>
							{idx + 1}
						</StyledTableCell>
						<StyledTableCell component="th" scope="row">
							{row.name}
						</StyledTableCell>
						<StyledTableCell align="center">{row.totalPoints}</StyledTableCell>
						<StyledTableCell align="center">{row.mode}</StyledTableCell>
						<StyledTableCell align="center">{row.date}</StyledTableCell>
					</StyledTableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>
);

export default LeaderboardTable;
