import { Button, Divider, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import LetterGuessedResult from '../enums/LetterGuessedResult';
import { useGameSettings } from '../hooks/useGameSettings';
import useGame, {
	addRound,
	addRoundGame,
	getCurrentRound,
	updateCurrentRoundGame,
	useCurrentRound,
	useGameContext
} from '../hooks/useGameTest';
import useLoggedInUser from '../hooks/useLoggedInUser';
import Game from '../types/Game';
import GameRound from '../types/GameRound';
import {
	createBoard,
	getEmptyGame,
	getEmptyGameFrom,
	getEmptyRound,
	getMultiplier,
	getPhrase,
	getUpdatedBoard,
	isAlpha,
	isPhraseSolved
} from '../utils/game';

import Board from './Board';
import Keyboard from './Keyboard';

const Play = () => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const gameSettings = useGameSettings();
	const user = useLoggedInUser();
	const [game, setGame] = useGameContext();
	// const [round, setRound] = useCurrentRound();

	// const [round, setRound] = useState<GameRound>(
	// 	game.rounds.at(-1) ?? getEmptyRound()
	// );

	// const newGame = getEmptyGame();
	// if (game === undefined) {
	// 	setGame(newGame);
	// 	// return <Loading />;
	// 	// replace with loading component
	// 	return <Typography>Loading...</Typography>;
	// }

	const round = game.rounds.at(-1) ?? getEmptyRound();
	// const round = game.rounds[0];

	// const [refreshFlag, setRefreshFlag] = useState(false);

	// useEffect(() => {
	// 	console.log('game updated');
	// 	setRound(game.rounds.at(-1) ?? getEmptyRound(game.rounds.length + 1));
	// }, [game]);

	// the issue is that when we load Play component, Round has its status set to 'InProgress'
	// but when we start the next round, new empty round is added to

	//
	//
	//
	//
	// useEffect(() => {
	// 	// used when round changes status from 'BeforeInit' to 'InProgress' .. TODO: can be placed to 'game.rounds.length'
	// 	// when it's umounted on change of round.status to 'Pass' or 'Fail', we remove listener and can't inform user
	// 	//   he shouldn't keep clicking - but use button instead - should happen on round addition
	// 	if (round.status === 'InProgress') {
	// 		// if (true) {
	// 		const listener = (e: KeyboardEvent) => {
	// 			// const g_ = useGame();
	// 			// const round_ = g_.rounds.at(-1) ?? getEmptyRound();
	// 			console.log(
	// 				`round.status: Play - using keydown listener: ${JSON.stringify(e)}`
	// 			);
	// 			// e.preventDefault();
	// 			// console.log('on refresh - in listener');

	// 			isAlpha(e.key) && onLetterGuessed(e.key);
	// 		};
	// 		document.addEventListener('keydown', listener);
	// 		console.log('round.status: Play - added keydown listener');
	// 		return () => {
	// 			console.log('round.status: Play - remove keydown listener');
	// 			document.removeEventListener('keydown', listener);
	// 		};
	// 	}
	// }, [round.status]);
	//
	//
	//

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

		// could be placed higher/outside function
		const letterPointValue = 20 * getMultiplier(gameSettings);
		round.guessedLetters.push(letter);
		// phrase doesn't contain such letter
		if (!round.phrase.includes(letter)) {
			// reduce number of guesses left
			enqueueSnackbar(`Wrong letter, -${letterPointValue} points!`);
			round.score -= 20;
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
			return LetterGuessedResult.IncorrectLetter;
		}

		// letter is in phrase and wasn't guessed yet
		round.board = getUpdatedBoard(round.board, letter);
		round.score += 20;
		enqueueSnackbar(`Correct letter, +${letterPointValue} points!`);
		setGame(updateCurrentRoundGame(game, round));
		// console.dir(`updated round: ${JSON.stringify(round)}`);

		if (isPhraseSolved(round.board)) {
			console.log('phrase solved');
			round.status = 'Pass';
			enqueueSnackbar('You have successfully solved the phrase!');
			// update round state, set times etc.
		}

		setGame(updateCurrentRoundGame(game, round));
		return LetterGuessedResult.CorrectLetter;
	};

	// >>> doesn't work properly, since it also doesn't allow to show 'Start new game / Submit score' screen
	//   because once we set game.status to 'Finished', and load the Play component, this useEffect is triggered (on mount),
	//   and therefore we always get 'navigated' to /game-over
	//
	// useEffect(() => {
	// 	console.log(`game.status useEffect: ${game.status}`);
	// 	// can be set via 'End game' button or due to losing (number of guessed / timer)
	// 	if (game.status === 'Finished') {
	// 		navigate('/game-over');
	// 	}
	// }, [game.status]);

	// -----------------[ on new round added ]------------------
	// get new phrase, create board for it, update status from 'BeforeInit' to 'InProgress'
	// also runs once on mount (?), which means we set the very first round as well
	useEffect(() => {
		console.log(
			`game.rounds.length useEffect trigged at value: ${game.rounds.length}`
		);
		(async () => {
			round.phrase = await getPhrase();
			round.board = createBoard(round.phrase);
			round.status = 'InProgress';
			setGame(updateCurrentRoundGame(game, round));
		})();

		const listener = (e: KeyboardEvent) => {
			// const g_ = useGame();
			// const round_ = g_.rounds.at(-1) ?? getEmptyRound();
			console.log(
				`game.rounds.length: Play - using keydown listener: ${JSON.stringify(
					e
				)}`
			);
			// e.preventDefault();
			// console.log('on refresh - in listener');

			isAlpha(e.key) && onLetterGuessed(e.key);
		};
		document.addEventListener('keydown', listener);
		console.log('game.rounds.length: Play - added keydown listener');
		return () => {
			console.log('game.rounds.length: Play - remove keydown listener');
			document.removeEventListener('keydown', listener);
		};
	}, [game.rounds.length]);

	// executed upon pressing 'Next level' button => creates a new empty round
	const onLoadNextRound = () => {
		setGame(addRoundGame(game));
	};

	const onStartNewGame = () => {
		setGame(getEmptyGameFrom(user, gameSettings));
	};
	const _onResetGame = onStartNewGame;

	const onEndGame = () => {
		console.log(`pressed onEndGame: ${game.status}`);
		game.status = 'Finished';
		setGame(game);
		navigate('/game-over');
	};

	// could add useEffect for game.status, so that we can add 'End game' button,
	//   which sets game.status to 'Finished'
	// in the useEffect, if game.status === 'Finished', navigate to /game-over

	useEffect(() => {
		// if game has already been initialized, it means localstorage contained the game
		// if (game.status !== 'BeforeInit') {
		// 	return;
		// }
		// addRound(getEmptyRound());
		// const emptyGame = getEmptyGame();
		// if (game === undefined) {
		// 	setGame(emptyGame);
		// }
		// if (round.status === 'BeforeInit') {
		// 	round.status = 'InProgress';
		// 	round.phrase = 'updated phrase';
		// 	setGame(updateCurrentRoundGame(game, round));
		// 	// setRound(round);
		// 	// return;
		// 	// setRound(round);
		// 	// addRound(getEmptyRound());
		// }
		// const listener = (e: KeyboardEvent) => {
		// 	// if (!isAlpha(e.key)) {
		// 	// 	return;
		// 	// }
		// 	// e.preventDefault();
		// 	// console.log('in listener (that is added on mount)');
		// 	// onLetterGuessed(e.key);
		// 	console.log('in listener (that is added on mount)');
		// 	isAlpha(e.key) && onLetterGuessed(e.key, r);
		// };
		// document.addEventListener('keydown', listener);
		// console.log('ON MOUNT: added keydown listener');
		// return () => {
		// 	document.removeEventListener('keydown', listener);
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
