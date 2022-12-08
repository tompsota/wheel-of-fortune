import { Button, Divider, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LetterGuessedResult from '../enums/LetterGuessedResult';
import { useGameSettings } from '../hooks/useGameSettings';
import useGame, {
	addRoundGame,
	addRoundGameAsync,
	updateCurrentRoundGame,
	useGameContext
} from '../hooks/useGameTest';
import useLoggedInUser from '../hooks/useLoggedInUser';
import Game from '../types/Game';
import GameRound from '../types/GameRound';
import {
	createBoard,
	getEmptyGame,
	getEmptyGameAsync,
	getEmptyGameFrom,
	getEmptyGameFromAsync,
	getEmptyRound,
	getMultiplier,
	getPhrase,
	getUpdatedBoard,
	isAlpha,
	isPhraseSolved,
	saveGame
} from '../utils/game';

import Board from './Board';
import Keyboard from './Keyboard';

const Play = () => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const gameSettings = useGameSettings();
	const user = useLoggedInUser();
	const [game, setGame] = useGameContext();

	const newGame = getEmptyGame();

	const round = game?.rounds.at(-1) ?? getEmptyRound();

	// the issue is that when we load Play component, Round has its status set to 'InProgress'
	// but when we start the next round, new empty round is added to

	// for when a new round is added
	// try again with just one listener added on mount, but try to solve why it wasn't working
	// - round wasn't getting updated? i.e. board wasn't updated?
	// useEffect(() => {}, [game.rounds.length]);

	// should get triggered when game gets updated, i.e. when we set new round (this round has a different round number)
	// useEffect(() => {}, [round.roundNumber]);

	const onLetterGuessed = (letter: string) => {
		if (game === undefined) {
			return;
		}

		if (round.status === 'Pass') {
			enqueueSnackbar(
				"You have already solved this phrase, use 'Next level' when ready to proceed to the next one!"
			);
			return;
			// return LetterGuessedResult.PhraseSolved;
		}

		console.log(`letter ${letter} guessed`);
		if (round.guessedLetters.includes(letter)) {
			// inform user that he already clicked on that letter?
			// maybe disable those letters on on-screen KB?
			console.log('already guessed');
			enqueueSnackbar(`You've already guessed letter ${letter}`);
			// snackbar with info ?
			// return LetterGuessedResult.AlreadyGuessedLetter;
			return;
		}

		// could be placed higher/outside function
		const incorrectLetterPointValue = 20;
		const correctLetterPointValue = 20 * getMultiplier(gameSettings);
		round.guessedLetters.push(letter);
		// phrase doesn't contain such letter
		if (!round.phrase.includes(letter)) {
			// reduce number of guesses left
			enqueueSnackbar(`Wrong letter, -${incorrectLetterPointValue} points!`, {
				variant: 'warning'
			});
			round.score -= incorrectLetterPointValue;
			if (round.guessesLeft) {
				round.guessesLeft -= 1;
			}

			// TODO: or if timer reaches zero
			if (round.guessesLeft === 0) {
				round.status = 'Fail';
				game.status = 'Finished';
				setGame(updateCurrentRoundGame(game, round));
				// should probably save game immediately? or set game.status to finished,
				// and only wait for player to submit the score on the 'game over' screen?
				// .. if he decided he doesn't wanna save the game to the leaderboard
				navigate('/game-over');
			}
			// if there is number of guesses set, decrease number and if equals to 0,
			// set status to 'fail' and navigate to 'game over'
			setGame(updateCurrentRoundGame(game, round));
			// return LetterGuessedResult.IncorrectLetter;
			return;
		}

		// letter is in phrase and wasn't guessed yet
		round.board = getUpdatedBoard(round.board, letter);
		round.score += correctLetterPointValue;
		enqueueSnackbar(`Correct letter, +${correctLetterPointValue} points!`, {
			variant: 'success'
		});
		setGame(updateCurrentRoundGame(game, round));

		if (isPhraseSolved(round.board)) {
			console.log('phrase solved');
			round.status = 'Pass';
			enqueueSnackbar('You have successfully solved the phrase!');
			saveGame(game);
			// update round state, set times etc.
		}

		setGame(updateCurrentRoundGame(game, round));
		// return LetterGuessedResult.CorrectLetter;
		return;
	};

	// -----------------[ on new round added ]------------------
	// get new phrase, create board for it, update status from 'BeforeInit' to 'InProgress'
	// also runs once on mount (?), which means we set the very first round as well
	useEffect(() => {
		if (game === undefined) {
			return;
		}
		console.log(
			`game.rounds.length useEffect trigged at value: ${game?.rounds.length}`
		);

		// TODO: remove completely if phrase is set in getEmptyRound (also 'BeforeInit' would be then useless?)
		//  ... actually it might be useless even now?
		(async () => {
			round.phrase = await getPhrase();
			round.board = createBoard(round.phrase);
			round.status = 'InProgress';
			setGame(updateCurrentRoundGame(game, round));
		})();

		const listener = (e: KeyboardEvent) => {
			console.log(
				`game.rounds.length: Play - using keydown listener: ${JSON.stringify(
					e
				)}`
			);

			isAlpha(e.key) && onLetterGuessed(e.key);
		};
		document.addEventListener('keydown', listener);
		console.log('game.rounds.length: Play - added keydown listener');
		return () => {
			console.log('game.rounds.length: Play - remove keydown listener');
			document.removeEventListener('keydown', listener);
		};
	}, [game?.rounds.length]);

	// executed upon pressing 'Next level' button => creates a new empty round
	const onLoadNextRound = () => {
		if (game !== undefined) {
			setGame(addRoundGame(game));
		}
	};

	const onLoadNextRoundAsync = async () => {
		if (game !== undefined) {
			setGame(await addRoundGameAsync(game));
		}
	};

	const onStartNewGameAsync = async () => {
		setGame(await getEmptyGameFromAsync(user, gameSettings));
	};

	const onStartNewGame = () => {
		setGame(getEmptyGameFrom(user, gameSettings));
	};
	const _onResetGame = onStartNewGame;

	const onEndGame = () => {
		if (game === undefined) {
			return;
		}
		console.log(`pressed onEndGame: ${game.status}`);
		game.status = 'Finished';
		setGame(game);
		navigate('/game-over');
	};

	// could add useEffect for game.status, so that we can add 'End game' button,
	//   which sets game.status to 'Finished'
	// in the useEffect, if game.status === 'Finished', navigate to /game-over

	useEffect(() => {
		if (game === undefined) {
			setGame(newGame);

			// if wanna use async (and init phrase in GetEmptyRound)
			// (async () => {
			// 	const newgam = await getEmptyGameFromAsync(user, gameSettings);
			// 	setGame(newgam);
			// })();
		} else if (game.status === 'Saved') {
			setGame(addRoundGame(game));

			// (async () => {
			// 	setGame(await addRoundGameAsync(game));
			// })();
		}

		// return () => {
		// 	saveGame(game);
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
					<Button sx={{ alignSelf: 'flex-end' }} onClick={onStartNewGame}>
						Reset game
					</Button>
					<Button sx={{ alignSelf: 'flex-end' }} onClick={onEndGame}>
						End game
					</Button>
				</Stack>
			</Grid>
		</Grid>
	);
};

export default Play;
