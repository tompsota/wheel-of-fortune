import { Button, Divider, Grid, Snackbar } from '@mui/material';
import { Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGameSettings } from '../hooks/useGameSettings';
import {
	addRoundGameAsync,
	updateCurrentRoundGame,
	useGameContext
} from '../hooks/useGame';
import useLoggedInUser from '../hooks/useLoggedInUser';
import {
	endGameWithNavigate,
	getCurrentRound,
	getEmptyGameFromAsync,
	getMultiplier,
	getUpdatedBoard,
	isAlpha,
	isPhraseSolved
} from '../utils/game';
import Board from '../components/Board';
import Keyboard from '../components/Keyboard';
import { upsertGameDB } from '../utils/firebase';

const Play = () => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const gameSettings = useGameSettings();
	const user = useLoggedInUser();
	const [game, setGame] = useGameContext();
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const round = getCurrentRound(game);

	const incorrectLetterPointValue = 20;
	const correctLetterPointValue = 20 * getMultiplier(gameSettings);

	const handleSnackbarClose = async () => {
		await onLoadNextRoundAsync();
		setSnackbarOpen(false);
		if (game) {
			upsertGameDB(game);
		}
	};

	const snackbarAction = (
		<Button
			size="small"
			onClick={async () => {
				await handleSnackbarClose();
			}}
		>
			Next level
		</Button>
	);

	const onIncorrectGuess = () => {
		if (game === undefined) {
			return;
		}

		enqueueSnackbar(`Wrong letter, -${incorrectLetterPointValue} points!`, {
			variant: 'error'
		});

		round.score -= incorrectLetterPointValue;
		game.score -= incorrectLetterPointValue;
		if (round.guessesLeft) {
			round.guessesLeft -= 1;
		}

		// timer is part of Board and ending game is handled through the timer itself
		if (round.guessesLeft === 0) {
			round.status = 'Fail';
			endGameWithNavigate(
				updateCurrentRoundGame(game, round),
				setGame,
				navigate
			);
			enqueueSnackbar(
				'You have run out of guesses! Your game has been uploaded to the leaderboard.',
				{
					autoHideDuration: 7500
				}
			);
			return;
		}

		setGame(updateCurrentRoundGame(game, round));
	};

	const onCorrectGuess = (letter: string) => {
		if (game === undefined) {
			return;
		}

		const re = new RegExp(letter, 'g');
		const totalValue =
			correctLetterPointValue * (round.phrase.match(re) ?? ' ').length;

		round.board = getUpdatedBoard(round.board, letter);
		round.score += totalValue;
		game.score += totalValue;

		enqueueSnackbar(`Correct letter, +${totalValue} points!`, {
			variant: 'success'
		});
		setGame(updateCurrentRoundGame(game, round));
	};

	const onLetterGuessed = (letter: string) => {
		if (game === undefined) {
			return;
		}

		if (round.status === 'Pass') {
			enqueueSnackbar(
				"You have already solved this phrase, use 'Next level' when ready to proceed to the next one!",
				{
					autoHideDuration: 5000
				}
			);
			return;
		}

		console.log(`letter ${letter} guessed`);
		if (round.guessedLetters.includes(letter)) {
			// inform user that he already clicked on that letter?
			// maybe disable those letters on on-screen KB?
			console.log('already guessed this letter');
			enqueueSnackbar(`You've already guessed letter ${letter.toUpperCase()}`);
			return;
		}

		round.guessedLetters.push(letter);

		// phrase doesn't contain such letter
		if (!round.phrase.includes(letter)) {
			// reduce number of guesses left

			onIncorrectGuess();
			return;
		}

		// letter is in phrase and wasn't guessed yet
		onCorrectGuess(letter);

		// >>> after a successful round, we save the game (still InProgress) to DB
		// ... new round is added to the game only upon player clicking 'Next level'
		if (isPhraseSolved(round.board)) {
			console.log('phrase solved');
			round.status = 'Pass';
			upsertGameDB(game);
			setSnackbarOpen(true);
		}

		setGame(updateCurrentRoundGame(game, round));
	};

	useEffect(() => {
		if (game === undefined) {
			return;
		}

		const listener = (e: KeyboardEvent) => {
			isAlpha(e.key) && onLetterGuessed(e.key);
		};

		document.addEventListener('keydown', listener);

		return () => {
			document.removeEventListener('keydown', listener);
		};
	}, [game?.rounds.length]);

	const onLoadNextRoundAsync = async () => {
		if (game !== undefined) {
			const updatedGame = await addRoundGameAsync(game);
			upsertGameDB(updatedGame);
			setGame(updatedGame);
		}
	};

	const onEndGame = () => {
		endGameWithNavigate(game, setGame, navigate);
		enqueueSnackbar('Your game has been uploaded to the leaderboard.', {
			autoHideDuration: 5000
		});
	};

	useEffect(() => {
		console.log('Play - mount');
		if (game === undefined) {
			console.log(`Play - on mount: game === undefined - setting new game`);
			(async () => {
				const newGame = await getEmptyGameFromAsync(user, gameSettings);
				setGame(newGame);
			})();
			// when we come back to game where we passed a round, but didn't start a new game,
			// we have to display the 'Next level' button
		} else if (round.status === 'Pass') {
			setSnackbarOpen(true);
		}
	}, []);

	return (
		<>
			<Grid
				container
				direction="column"
				sx={{ display: 'flex', height: '100%' }}
			>
				<Grid item xs={6}>
					<Board board={round.board} />
				</Grid>
				<Grid item xs={6}>
					<Stack sx={{ display: 'flex', height: '100%' }}>
						<Divider />
						<Keyboard />
						<Button sx={{ alignSelf: 'flex-end' }} onClick={onEndGame}>
							End game
						</Button>
					</Stack>
				</Grid>
			</Grid>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={snackbarOpen}
				message="You have successfully solved the phrase!"
				action={snackbarAction}
			/>
		</>
	);
};

export default Play;
