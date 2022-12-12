import axios from 'axios';
import { User } from 'firebase/auth';
import React from 'react';
import wrap from 'word-wrap';

import { useGameSettings } from '../hooks/useGameSettings';
import { useGameContext } from '../hooks/useGameTest';
import useLoggedInUser from '../hooks/useLoggedInUser';
import Board, { BoardRow, BoardTile } from '../types/Board';
import Game from '../types/Game';
import GameRound from '../types/GameRound';
import GameSettings from '../types/GameSettings';
import PhraseData from '../types/PhraseData';

import { upsertGameDB } from './firebase';

export const getEmptyRound = (
	roundNumber = 1,
	settings?: GameSettings,
	phrase = ''
): GameRound => {
	const _tmp = 0;
	// const game = useGame();
	// const phrase = await getPhraseFromAPI();

	return {
		board: createBoard(phrase),
		status: 'BeforeInit',
		roundNumber,
		guessedLetters: [],
		score: 0,
		phrase,
		phraseAuthor: 'Unknown',
		guessesLeft: settings?.numberOfGuesses,
		timeLeftOnTimer: settings?.timer
	};
};

export const getEmptyRoundAsync = async (
	roundNumber = 1,
	settings?: GameSettings
): Promise<GameRound> =>
	// const { phrase, author } = await getPhrase();
	({
		board: createBoard('phrase'),
		status: 'BeforeInit',
		roundNumber,
		guessedLetters: [],
		score: 0,
		phrase: 'phrase',
		phraseAuthor: 'author',
		guessesLeft: settings?.numberOfGuesses,
		timeLeftOnTimer: settings?.timer
	});

export const getEmptyGame = (): Game => {
	const user = useLoggedInUser();
	const settings = useGameSettings();
	return getEmptyGameFrom(user, settings);
};

export const getEmptyGameAsync = async (): Promise<Game> => {
	const user = useLoggedInUser();
	const settings = useGameSettings();
	return getEmptyGameFromAsync(user, settings);
};

export const getEmptyGameFrom = (
	user: User | undefined,
	settings: GameSettings
): Game => ({
	// id: '',
	playerId: user?.uid ?? 'anonymousUserId', // TODO: create user for anonymous players? so that it can be saved and displayed on leaderboard
	status: 'InProgress',
	score: 0,
	rounds: [getEmptyRound(1, settings)],
	settings,
	startedAt: new Date()
});

export const getEmptyGameFromAsync = async (
	user: User | undefined,
	settings: GameSettings
): Promise<Game> => ({
	// id: '',
	playerId: user?.uid ?? '',
	status: 'InProgress',
	score: 0,
	rounds: [await getEmptyRoundAsync(1, settings)],
	settings,
	startedAt: new Date()
});

const alphaChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
	''
);
export const isAlpha = (c: string): boolean => alphaChars.includes(c);

export const isPhraseSolved = (board: Board): boolean =>
	board.every(row =>
		row.every(field => field.hidden === false || field.value === undefined)
	);

// const transformedBoardState = (board: BoardState)

// uncover letters
// TODO: in general, make sure uppercase/lowercase is handled properly
// const getUpdatedBoard = (board: BoardState, letter: string): BoardState => {
// 	const updatedBoard = board.map(field =>
// 		field.value === letter ? { ...field, hidden: false } : field
// 	);
// 	return updatedBoard;
// };

export const getUpdatedBoard = (board: Board, letter: string): Board =>
	board.map(row => getUpdatedRow(row, letter));

const getUpdatedRow = (row: BoardRow, letter: string): BoardRow =>
	row.map(field =>
		// field.hidden || field.value === undefined || field.value !== letter
		field.value === undefined || field.value !== letter
			? field
			: { ...field, hidden: false }
	);

const getPhraseChunks = (phrase: string) =>
	wrap(phrase.replace(/\.$/, ''), { width: 15 }).split('\n');

export const createBoard = (phrase: string): Board =>
	getPhraseChunks(phrase).map(word =>
		Array.from(word).map(c => ({ hidden: isAlpha(c), value: c } as BoardTile))
	);

export const getPhrase = async (): Promise<PhraseData> => {
	const p = await axios.get('https://api.quotable.io/random?maxLength=35');
	return { phrase: p.data.content.toLowerCase(), author: p.data.author };
};

export const getScore = (game: Game): number =>
	game.rounds.map(round => round.score).reduce((acc, val) => acc + val);

export const getMultiplier = (settings: GameSettings): number =>
	getNumberOfGuessesMultiplier(settings.numberOfGuesses) *
	getTimerMultiplier(settings.timer);

const getNumberOfGuessesMultiplier = (
	numberOfGuesses: number | undefined
): number => {
	switch (numberOfGuesses) {
		case undefined:
			return 1;
		case 10:
			return 1.2;
		case 5:
			return 1.5;
		case 3:
			return 2.0;
		default:
			return 1;
	}
};

// timer is (currently) saved in minutes
const getTimerMultiplier = (timer: number | undefined): number => {
	switch (timer) {
		case undefined:
			return 1;
		case 5:
			return 1.2;
		case 3:
			return 1.5;
		case 1:
			return 2.0;
		default:
			return 1;
	}
};

// set game status to 'Finished', and remove current game from context (set to undefined),
// which means a new game will be created when user starts playing again
export const endGameHookIssue = (gameToSave?: Game) => {
	const [game, setGame] = useGameContext();
	if (gameToSave === undefined) {
		gameToSave = game;
	}

	if (gameToSave !== undefined) {
		gameToSave.status = 'Finished';
		upsertGameDB(gameToSave, setGame);
	}
	setGame(undefined);
};

export const endGame = (
	game: Game | undefined,
	setGame: (value: React.SetStateAction<Game | undefined>) => void
) => {
	if (game !== undefined) {
		game.status = 'Finished';
		upsertGameDB(game, setGame);
	}
	setGame(undefined);
};
