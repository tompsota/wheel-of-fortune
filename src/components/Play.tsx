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

	const [game, setGame] = useGameContext();
	// const [round, setRound] = useCurrentRound();

	// const [round, setRound] = useState<GameRound>(
	// 	game.rounds.at(-1) ?? getEmptyRound()
	// );

	const round = game.rounds.at(-1) ?? getEmptyRound();

	// const [refreshFlag, setRefreshFlag] = useState(false);

	// useEffect(() => {
	// 	console.log('game updated');
	// 	setRound(game.rounds.at(-1) ?? getEmptyRound(game.rounds.length + 1));
	// }, [game]);

	// the issue is that when we load Play component, Round has its status set to 'InProgress'
	// but when we start the next round, new empty round is added to
	useEffect(() => {
		if (round.status === 'InProgress' || round.status === 'BeforeInit') {
			// if (true) {
			const listener = (e: KeyboardEvent) => {
				console.log(
					`keydown listener - Play - on refresh: ${JSON.stringify(e)}`
				);
				// e.preventDefault();
				// console.log('on refresh - in listener');

				isAlpha(e.key) && onLetterGuessed(e.key);
			};
			document.addEventListener('keydown', listener);
			console.log('on refresh - added keydown listener');
			return () => {
				document.removeEventListener('keydown', listener);
			};
		}
	}, [round.status]);

	// for when a new round is added
	// try again with just one listener added on mount, but try to solve why it wasn't working
	// - round wasn't getting updated? i.e. board wasn't updated?
	// useEffect(() => {}, [game.rounds.length]);

	// should get triggered when game gets updated, i.e. when we set new round (this round has a different round number)
	// useEffect(() => {}, [round.roundNumber]);

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

		// letter is in phrase and wasn't guessed yet
		round.board = getUpdatedBoard(round.board, letter);
		round.score += 20;
		setGame(updateCurrentRoundGame(game, round));
		console.dir(`updated round: ${JSON.stringify(round)}`);

		if (isPhraseSolved(round.board)) {
			console.log('phrase solved');
			round.status = 'Pass';
			enqueueSnackbar('You have successfully solved the phrase!');
			// update round state, set times etc.
		}

		setGame(updateCurrentRoundGame(game, round));
		return LetterGuessedResult.CorrectLetter;
	};

	// executed upon pressing 'Next level' button => creates a new empty round
	const onLoadNextRound = () => {
		setGame(addRoundGame(game));
	};

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
			// setRound(round);

			// return;
			// setRound(round);
			// addRound(getEmptyRound());
		}

		// setRound(round);
		// setGame(addRoundGame(game, round));

		// const listener = (e: KeyboardEvent) => {
		// 	// if (!isAlpha(e.key)) {
		// 	// 	return;
		// 	// }
		// 	// e.preventDefault();
		// 	// console.log('in listener (that is added on mount)');
		// 	// onLetterGuessed(e.key);

		// 	console.log('in listener (that is added on mount)');
		// 	isAlpha(e.key) && onLetterGuessed(e.key);
		// };
		// document.addEventListener('keydown', listener);
		// console.log('added keydown listener');
		// return () => {
		// 	document.removeEventListener('keydown', listener);
		// };
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
