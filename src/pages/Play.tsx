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
	endGame,
	getEmptyGame,
	getEmptyGameAsync,
	getEmptyGameFrom,
	getEmptyGameFromAsync,
	getEmptyRound,
	getMultiplier,
	getPhrase,
	getUpdatedBoard,
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

	const newGame = getEmptyGame();

	const round = game?.rounds.at(-1) ?? getEmptyRound();

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
			setGame(updateCurrentRoundGame(game, round)); // is necessary to update manually?
			endGame(game, setGame);
			enqueueSnackbar('Game over! Your result has been saved.');
			navigate('/game-over');
			return;
		}

		setGame(updateCurrentRoundGame(game, round)); // TODO: not necessary?
	};

	const onCorrectGuess = (letter: string) => {
		if (game === undefined) {
			return;
		}

		round.board = getUpdatedBoard(round.board, letter);
		round.score += correctLetterPointValue;
		game.score += correctLetterPointValue;

		enqueueSnackbar(`Correct letter, +${correctLetterPointValue} points!`, {
			variant: 'success'
		});
		setGame(updateCurrentRoundGame(game, round));
	};

	const onLetterGuessed = (letter: string) => {
		console.log(`round: ${JSON.stringify(round)}`);

		if (game === undefined) {
			return;
		}

		if (round.status === 'Pass') {
			enqueueSnackbar(
				"You have already solved this phrase, use 'Next level' when ready to proceed to the next one!"
			);
			return;
		}

		console.log(`letter ${letter} guessed`);
		if (round.guessedLetters.includes(letter)) {
			// inform user that he already clicked on that letter?
			// maybe disable those letters on on-screen KB?
			console.log('already guessed this letter');
			enqueueSnackbar(`You've already guessed letter ${letter}`);
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

			enqueueSnackbar('You have successfully solved the phrase!');
			upsertGameDB(game, setGame);
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
		console.log(
			`game.rounds.length useEffect trigged at value: ${game?.rounds.length}`
		);

		// TODO: remove completely if phrase is set in getEmptyRound (also 'BeforeInit' would be then useless?)
		// ... i.e. if async versions of functions are used
		//  ... actually it might be useless even now?
		if (round.status === 'BeforeInit') {
			(async () => {
				round.phrase = await getPhrase();
				round.board = createBoard(round.phrase);
				round.status = 'InProgress';
				setGame(updateCurrentRoundGame(game, round));
			})();
		}

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
	// TODO: replace with async version
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
		endGame(game, setGame);
		// if (game === undefined) {
		// 	return;
		// }
		// console.log(`pressed onEndGame: ${game.status}`);
		// game.status = 'Finished';
		// setGame(game);
		navigate('/game-over');
	};

	// could add useEffect for game.status, so that we can add 'End game' button,
	//   which sets game.status to 'Finished'
	// in the useEffect, if game.status === 'Finished', navigate to /game-over

	useEffect(() => {
		if (game === undefined) {
			console.log(`Play - on mount: setting new game`);
			setGame(newGame);

			// if wanna use async (and init phrase in GetEmptyRound)
			// (async () => {
			// 	const newgam = await getEmptyGameFromAsync(user, gameSettings);
			// 	setGame(newgam);
			// })();
		}
		// else if (game.status === 'Saved') {
		// 	setGame(addRoundGame(game));

		// 	// (async () => {
		// 	// 	setGame(await addRoundGameAsync(game));
		// 	// })();
		// }

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
					{/* <Button sx={{ alignSelf: 'flex-end' }} onClick={onEndGame}>
						End game
					</Button> */}
					<Button sx={{ alignSelf: 'flex-end' }} onClick={onLoadNextRound}>
						Next level
					</Button>
				</Stack>
			</Grid>
		</Grid>
	);
};

export default Play;
