import { FC } from 'react';
import { Stack, Typography, useTheme } from '@mui/material';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import Countdown, { CountdownTimeDelta } from 'react-countdown';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import BoardState, { BoardRow } from '../types/Board';
import { useGameContext } from '../hooks/useGame';
import {
	endGameWithNavigate,
	getCurrentRound,
	getRoundTimerDeadline
} from '../utils/game';

import Tile from './Tile';

type Props = {
	board: BoardState;
};

const Board: FC<Props> = ({ board }) => {
	const theme = useTheme();
	const [game, setGame] = useGameContext();
	const round = getCurrentRound(game);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

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

	const renderer = ({ minutes, seconds, completed }: CountdownTimeDelta) => {
		if (completed) {
			return (
				<Typography color={theme.palette.info.main}>Time&apos;s up!</Typography>
			);
		} else {
			return (
				<Typography color={theme.palette.info.main}>
					{`00${minutes}`.slice(-2)}:{`00${seconds}`.slice(-2)}
				</Typography>
			);
		}
	};

	return (
		<Stack
			sx={{
				display: 'flex',
				justifyContent: 'center',
				height: '100%'
			}}
		>
			<Typography
				alignSelf="center"
				textTransform="uppercase"
				color={theme.palette.primary.main}
				sx={{ ml: '0.5rem' }}
			>
				Your phrase:
			</Typography>
			<Stack
				sx={{
					backgroundColor: theme.palette.backgroundLight,
					borderRadius: '0.25rem',
					padding: '1rem',
					mt: '0.5rem',
					mb: '0.2rem'
				}}
			>
				{board.map(boardRow)}
			</Stack>
			<Stack
				direction="row"
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					mb: '0.3rem',
					mx: '0.5rem'
				}}
			>
				<Stack direction="row">
					<Stack direction="row" sx={{ mr: '2rem' }}>
						<Typography
							color={theme.palette.primary.main}
							textTransform="uppercase"
						>
							Guesses left:&nbsp;
						</Typography>
						{game?.settings.numberOfGuesses ? (
							<Typography color={theme.palette.info.main}>
								{round.guessesLeft}
							</Typography>
						) : (
							<AllInclusiveIcon color="info" />
						)}
					</Stack>
					<Stack direction="row">
						<Typography
							color={theme.palette.primary.main}
							textTransform="uppercase"
						>
							Time left:&nbsp;
						</Typography>
						{game?.settings.timer ? (
							<Countdown
								date={getRoundTimerDeadline(round, game.settings.timer)}
								renderer={renderer}
								onComplete={() => {
									endGameWithNavigate(game, setGame, navigate);
									enqueueSnackbar(
										'You have run out of time! Your game has been uploaded to the leaderboard.',
										{
											autoHideDuration: 7500
										}
									);
								}}
							/>
						) : (
							<AllInclusiveIcon color="info" />
						)}
					</Stack>
				</Stack>
				<Typography
					variant="caption"
					color={theme.palette.primary.main}
					fontStyle="italic"
					fontSize="0.85rem"
					sx={{ alignSelf: 'flex-end' }}
				>
					- {game?.rounds.at(-1)?.phraseAuthor ?? 'Unknown author'}
				</Typography>
			</Stack>
		</Stack>
	);
};

export default Board;
