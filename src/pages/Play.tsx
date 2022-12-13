import { Button, Divider, Grid, Snackbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useGameSettings } from '../hooks/useGameSettings';
import {
	addRoundGame,
	addRoundGameAsync,
	updateCurrentRoundGame,
	useGameContext
} from '../hooks/useGame';
import useLoggedInUser from '../hooks/useLoggedInUser';
import {
	createBoard,
	endGame,
	endGameWithNavigate,
	getEmptyGame,
	getEmptyGameFrom,
	getEmptyGameFromAsync,
	getEmptyRound,
	getMultiplier,
	getPhrase,
	getPlaceholderRound,
	getRoundTimerDeadline,
	getUpdatedBoard,
	hasTimerRunOut,
	isAlpha,
	isPhraseSolved
	// saveGame,
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

	const newGame = getEmptyGame();

	const round = game?.rounds.at(-1) ?? getPlaceholderRound();

	const incorrectLetterPointValue = 20;
	const correctLetterPointValue = 20 * getMultiplier(gameSettings);

	// the issue is that when we load Play component, Round has its status set to 'InProgress'
	// but when we start the next round, new empty round is added to

	// for when a new round is added
	// try again with just one listener added on mount, but try to solve why it wasn't working
	// - round wasn't getting updated? i.e. board wasn't updated?
	// useEffect(() => {}, [game.rounds.length]);

	// should get triggered when game gets updated, i.e. when we set new round (this round has a different round number)
	// useEffect(() => {}, [round.roundNumber]);

	const handleSnackbarClose = async () => {
		await onLoadNextRoundAsync();
		setSnackbarOpen(false);
		if (game) {
			upsertGameDB(game, setGame);
		}
		onLoadNextRound();
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

		// TODO: or if timer reaches zero
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

		setGame(updateCurrentRoundGame(game, round)); // TODO: not necessary?
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
		// console.log(`round: ${JSON.stringify(round)}`);

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
		// TODO: check if it works correctly, if player leaves 'Play' after guessing phrase,
		//       but before clicking 'Next play'
		if (isPhraseSolved(round.board)) {
			console.log('phrase solved');
			round.status = 'Pass';
			// TODO: check if round status is set to pass, or we need to call:
			// setGame(updateCurrentRoundGame(game, round));
			// ... explicitly

			setSnackbarOpen(true);

			// update round state, set times etc.
		}

		setGame(updateCurrentRoundGame(game, round));
		// return LetterGuessedResult.CorrectLetter;
	};

	// -----------------[ on new round added ]------------------
	// get new phrase, create board for it, update status from 'BeforeInit' to 'InProgress'
	// also runs once on mount (?), which means we set the very first round as well
	useEffect(() => {
		if (game === undefined) {
			return;
		}
		// console.log(
		// 	`game.rounds.length useEffect trigged at value: ${game?.rounds.length}`
		// );

		// TODO: remove completely if phrase is set in getEmptyRound (also 'BeforeInit' would be then useless?)
		// ... i.e. if async versions of functions are used
		//  ... actually it might be useless even now?
		// if (round.status === 'BeforeInit') {
		// 	(async () => {
		// 		const { phrase, author } = await getPhrase();
		// 		round.phrase = phrase;
		// 		round.phraseAuthor = author;
		// 		round.board = createBoard(round.phrase);
		// 		round.status = 'InProgress';
		// 		setGame(updateCurrentRoundGame(game, round));
		// 	})();
		// }

		const listener = (e: KeyboardEvent) => {
			// console.log(
			// 	`game.rounds.length: Play - using keydown listener: ${JSON.stringify(
			// 		e
			// 	)}`
			// );

			isAlpha(e.key) && onLetterGuessed(e.key);
		};
		document.addEventListener('keydown', listener);
		// console.log('game.rounds.length: Play - added keydown listener');
		return () => {
			// console.log('game.rounds.length: Play - remove keydown listener');
			document.removeEventListener('keydown', listener);
		};
	}, [game?.rounds.length]);

	// executed upon pressing 'Next level' button => creates a new empty round
	// TODO: replace with async version
	const onLoadNextRound = () => {
		if (game !== undefined) {
			const newGame = addRoundGame(game);
			console.log(`added new round: ${JSON.stringify(newGame)}`);
			upsertGameDB(newGame, setGame);
			setGame(newGame);
			// setGame(addRoundGame(game));
		}
	};

	const onLoadNextRoundAsync = async () => {
		if (game !== undefined) {
			const updatedGame = await addRoundGameAsync(game);
			upsertGameDB(updatedGame, setGame);
			setGame(updatedGame);
		}
	};

	// const onStartNewGameAsync = async () => {
	// 	setGame(await getEmptyGameFromAsync(user, gameSettings));
	// };

	// const onStartNewGame = () => {
	// 	setGame(getEmptyGameFrom(user, gameSettings));
	// };
	// const _onResetGame = onStartNewGame;

	const onEndGame = () => {
		endGameWithNavigate(game, setGame, navigate);
		enqueueSnackbar('Your game has been uploaded to the leaderboard.', {
			autoHideDuration: 5000
		});
		// if (game === undefined) {
		// 	return;
		// }
		// console.log(`pressed onEndGame: ${game.status}`);
		// game.status = 'Finished';
		// setGame(game);
	};

	// could add useEffect for game.status, so that we can add 'End game' button,
	//   which sets game.status to 'Finished'
	// in the useEffect, if game.status === 'Finished', navigate to /game-over

	useEffect(() => {
		console.log('Play - mount');
		if (game === undefined) {
			console.log(`Play - on mount: game === undefined - setting new game`);
			// setGame(newGame);

			// if wanna use async (and init phrase in GetEmptyRound)
			(async () => {
				const newGame = await getEmptyGameFromAsync(user, gameSettings);
				setGame(newGame);
			})();
			// when we come back to game where we passed a round, but didn't start a new game
			// } else if (isPhraseSolved(round.board)) {
		} else if (round.status === 'Pass') {
			setSnackbarOpen(true);
			// if we leave a game running (after starting a new round), the timer might run out,
			// and after coming back (getting unfinished round from DB), we have to mark the round/game
			// as failed
			// ... also add round.status !== 'Fail' check so the game doesn't get inserted several times
			//    .. doesn't work properly tho
			// TIMER handles onComplete on its own?
		}
		// else if (
		// 	hasTimerRunOut(round, game.settings) &&
		// 	round.status !== 'Fail'
		// ) {
		// 	console.log('Play - mount - timer has run out');
		// 	enqueueSnackbar('Timer has run out!');
		// 	round.status = 'Fail';
		// 	endGame(updateCurrentRoundGame(game, round), setGame);
		// 	// navigate('/');
		// }

		// return () => {
		// 	console.log(`Play - unmount - game: ${JSON.stringify(game)}`);
		// 	if (game !== undefined) {
		// 		// console.log(`unmount Play - update game: ${JSON.stringify(game)}`);
		// 		// it has the old state that it was mounted with?
		// 		console.log('upsertGame - Play unmount');
		// 		upsertGameDB(game, setGame);
		// 		// setGame(game);
		// 	}
		// };
	}, []);

	// if game.status === 'Finished', we could display 2 buttons:
	//  - maybe a title saying 'Your last game is finished, but score is not saved yet'
	//  - Submit score
	//  - Start a new game
	// if game.status === 'InProgress', display the game with board itself
	// if game.status === 'Paused', we could display two buttons:
	//  - 'Start a new game',
	//  - Continue game
	//  - not sure if state will be restored kinda automatically (i.e. not too much work),
	//    if it's way too difficult, then fuck 'Pause' functionality in general
	//
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
						<Button
							// component={Link}
							sx={{ alignSelf: 'flex-end' }}
							onClick={onEndGame}
							// to="/"
						>
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
