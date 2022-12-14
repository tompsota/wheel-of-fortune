import axios from 'axios';
import React from 'react';
import wrap from 'word-wrap';
import { NavigateFunction } from 'react-router-dom';

import { useGameSettings } from '../hooks/useGameSettings';
import useLoggedInUser from '../hooks/useLoggedInUser';
import Board, { BoardRow, BoardTile } from '../types/Board';
import Game from '../types/Game';
import GameRound from '../types/GameRound';
import GameSettings from '../types/GameSettings';
import PhraseData from '../types/PhraseData';
import User from '../types/User';
import GameWithPlayer from '../types/GameWithPlayer';

import { upsertGameDB } from './firebase';

export const getPlaceholderRound = (
	roundNumber = 1,
	settings?: GameSettings
): GameRound => {
	const phrase = '        ';
	return {
		board: createBoard(phrase),
		status: 'InProgress',
		roundNumber,
		guessedLetters: [],
		score: 0,
		phrase,
		phraseAuthor: 'Unknown',
		guessesLeft: settings?.numberOfGuesses ?? null,
		timeLeftOnTimer: settings?.timer ?? null,
		startedAt: new Date()
	};
};

export const getEmptyRoundAsync = async (
	roundNumber = 1,
	settings?: GameSettings
): Promise<GameRound> => {
	const { phrase, author } = await getPhrase();
	return {
		board: createBoard(phrase),
		status: 'InProgress',
		roundNumber,
		guessedLetters: [],
		score: 0,
		phrase,
		phraseAuthor: author,
		guessesLeft: settings?.numberOfGuesses ?? null,
		timeLeftOnTimer: settings?.timer ?? null,
		startedAt: new Date()
	};
};

export const getEmptyGameAsync = async (): Promise<Game> => {
	const user = useLoggedInUser();
	const settings = useGameSettings();
	return getEmptyGameFromAsync(user, settings);
};

export const getEmptyGameFromAsync = async (
	user: User | undefined,
	settings: GameSettings
): Promise<Game> => ({
	playerId: user?.id ?? null,
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

export const getUpdatedBoard = (board: Board, letter: string): Board =>
	board.map(row => getUpdatedRow(row, letter));

const getUpdatedRow = (row: BoardRow, letter: string): BoardRow =>
	row.map(field =>
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
	numberOfGuesses: number | null
): number => {
	switch (numberOfGuesses) {
		case null:
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

// timer is (currently) saved in seconds
const getTimerMultiplier = (timer: number | null): number => {
	switch (timer) {
		case null:
			return 1;
		case 5 * 60:
			return 1.2;
		case 3 * 60:
			return 1.5;
		case 1 * 60:
			return 2.0;
		default:
			return 1;
	}
};

export const endGame = (
	game: Game | undefined,
	setGame: (value: React.SetStateAction<Game | undefined>) => void
) => {
	if (game !== undefined) {
		game.status = 'Finished';
		upsertGameDB(game);
	}
	setGame(undefined);
};

export const endGameWithNavigate = (
	game: Game | undefined,
	setGame: (value: React.SetStateAction<Game | undefined>) => void,
	navigate: NavigateFunction
) => {
	if (game !== undefined) {
		game.status = 'Finished';
		upsertGameDB(game);
	}
	navigate('/');
	setGame(undefined);
};

export const getGameMode = (game: GameWithPlayer): string => {
	let mode = '';

	if (game.settings.timer === null && game.settings.numberOfGuesses === null) {
		return 'endless';
	}

	switch (game.settings.timer) {
		case null:
			mode += 'infinite time';
			break;
		default:
			mode += `${game.settings.timer} seconds`;
			break;
	}

	mode += `, `;

	switch (game.settings.numberOfGuesses) {
		case null:
			mode += 'infinite lives';
			break;
		default:
			mode += `${game.settings.numberOfGuesses} lives`;
			break;
	}

	return mode;
};

export const getCurrentRound = (game: Game | undefined): GameRound =>
	game?.rounds.at(-1) ?? getPlaceholderRound();

export const getRoundTimerDeadline = (
	round: GameRound,
	timerSettingsValue: number
): Date => new Date(round.startedAt.getTime() + timerSettingsValue * 1000);

// returns whether timer has run out for given round
export const hasTimerRunOut = (
	round: GameRound,
	settings: GameSettings
): boolean => {
	if (settings.timer === null) {
		return false;
	}

	return new Date() >= getRoundTimerDeadline(round, settings.timer);
};
