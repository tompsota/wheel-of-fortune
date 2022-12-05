import { Button, Divider, Grid } from '@mui/material';
import { Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import LetterGuessedResult from '../enums/LetterGuessedResult';
import useGame, {
	addRound,
	addRoundGame,
	getCurrentRound,
	updateCurrentRoundGame,
	useCurrentRound,
	useGameContext
} from '../hooks/useGameTest';
import GameRound from '../types/GameRound';
import {
	getEmptyRound,
	getUpdatedBoard,
	isAlpha,
	isPhraseSolved
} from '../utils/game';

import Board from './Board';
import Keyboard from './Keyboard';

const Play = () => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	// const game = useGame();
	const [game, setGame] = useGameContext();
	// const [round, setRound] = useCurrentRound();
	// const round = game.rounds[0] ?? getEmptyRound();
	const [round, setRound] = useState<GameRound>(
		game.rounds.at(-1) ?? getEmptyRound()
	);

	// const [refreshFlag, setRefreshFlag] = useState(false);

	useEffect(() => {
		setRound(game.rounds.at(-1) ?? getEmptyRound(game.rounds.length + 1));
	}, [game]);

	useEffect(() => {
		if (round.status === 'BeforeInit') {
			const listener = (e: KeyboardEvent) => {
				e.preventDefault();
				console.log('on refresh - in listener');
				isAlpha(e.key) && onLetterGuessed(e.key);
			};
			document.addEventListener('keydown', listener);
			console.log('on refresh - added keydown listener');
			return () => {
				document.removeEventListener('keydown', listener);
			};
		}
	}, [round.status]);

	const onLetterGuessed = (letter: string): LetterGuessedResult => {
		if (round.status === 'Pass') {
			enqueueSnackbar(
				"You have already solved this phrase, use 'Next level' when ready to proceed to the next one!"
			);
			return LetterGuessedResult.PhraseSolved;
		}

		console.log(`letter ${letter} guessed`);
		if (round.guessedLetters.includes(letter)) {
			// inform user that he already clicked on that letter?
			// maybe disable those letters on on-screen KB?
			console.log('already guessed');
			enqueueSnackbar(`You've already guessed letter ${letter}`);
			// snackbar with info ?
			return LetterGuessedResult.AlreadyGuessedLetter;
		}

		round.guessedLetters.push(letter);
		// phrase doesn't contain such letter
		if (!round.phrase.includes(letter)) {
			// reduce number of guesses left
			round.score -= 20;
			if (round.guessesLeft) {
				round.guessesLeft -= 1;
			}

			// TODO: or if timer reaches zero
			if (round.guessesLeft === 0) {
				round.status = 'Fail';
				setGame(updateCurrentRoundGame(game, round));
				// should probably save game immediately? or set game.status to finished,
				// and only wait for player to submit the score on the 'game over' screen?
				// .. if he decided he doesn't wanna save the game to the leaderboard
				navigate('/game-over');
			}
			// if there is number of guesses set, decrease number and if equals to 0,
			// set status to 'fail' and navigate to 'game over'
			setGame(updateCurrentRoundGame(game, round));
			enqueueSnackbar(`Letter ${letter} is not in the phrase`);
			console.log('incorrect guess');
			return LetterGuessedResult.IncorrectLetter;
		}

		// update board, check if full phrase is guessed

		// enqueueSnackbar(`Letter ${letter} is the phrase`);
		console.log(`onLetterGuessed - board: ${JSON.stringify(round.board)}`);

		const updatedBoard = getUpdatedBoard(round.board, letter);
		console.log(
			`onLetterGuessed - updated board: ${JSON.stringify(updatedBoard)}`
		);
		// setBoard(getUpdatedBoard(board, letter));

		round.board = updatedBoard;

		round.score += 20;
		setGame(updateCurrentRoundGame(game, round));
		console.dir(`updated round: ${JSON.stringify(round)}`);

		if (isPhraseSolved(round.board)) {
			console.log('phrase solved');
			round.status = 'Pass';
			enqueueSnackbar('You have successfully solved the phrase!');
			// update round state, set times etc.
			// create a new empty round in game
		}

		setGame(updateCurrentRoundGame(game, round));
		// check for win / if number of guesses left reached 0,
		// and handle win / loss
		return LetterGuessedResult.CorrectLetter;
	};

	const onLoadNextRound = () => {
		setGame(addRoundGame(game));
	};

	// const tmp = 0;
	// if (round.status === 'BeforeInit') {
	// 	round.status = 'InProgress';
	// 	setRound(round);
	// 	// addRound(getEmptyRound());
	// }

	useEffect(() => {
		// if game has already been initialized, it means localstorage contained the game
		// if (game.status !== 'BeforeInit') {
		// 	return;
		// }
		// addRound(getEmptyRound());

		if (round.status === 'BeforeInit') {
			round.status = 'InProgress';
			round.phrase = 'updated phrase';
			setGame(updateCurrentRoundGame(game, round));

			// return;
			// setRound(round);
			// addRound(getEmptyRound());
		}

		// setRound(round);
		// setGame(addRoundGame(game, round));

		const listener = (e: KeyboardEvent) => {
			e.preventDefault();
			console.log('in listener');
			isAlpha(e.key) && onLetterGuessed(e.key);
		};
		document.addEventListener('keydown', listener);
		console.log('added keydown listener');
		return () => {
			document.removeEventListener('keydown', listener);
		};
	}, []);

	return (
		<Grid container direction="column" sx={{ display: 'flex', height: '100%' }}>
			<Grid item xs={6}>
				<Board board={round.board} />
			</Grid>
			<Grid item xs={6}>
				<Stack sx={{ display: 'flex', height: '100%' }}>
					<Divider />
					<Keyboard />
					<Button
						sx={{ alignSelf: 'flex-end' }}
						disabled={round.status !== 'Pass'}
						onClick={onLoadNextRound}
					>
						Next level
					</Button>
				</Stack>
			</Grid>
		</Grid>
	);
};

export default Play;
