import { useGameSettings } from '../hooks/useGameSettings';
import useGame from '../hooks/useGameTest';
import useLoggedInUser from '../hooks/useLoggedInUser';
import Board, { BoardRow, BoardTile } from '../types/Board';
import Game from '../types/Game';
import GameRound from '../types/GameRound';
import GameSettings from '../types/GameSettings';

const getPhraseFromAPI = async (): Promise<string> => 'test phrase';
const initBoard = (phrase: string): Board => [];

// export const getEmptyRound = async (): Promise<GameRound> => {
export const getEmptyRound = (
	roundNumber = 1,
	settings?: GameSettings,
	phrase = 'test phrase'
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
		guessesLeft: settings?.numberOfGuesses,
		timeLeftOnTimer: settings?.timer
	};
};

export const getEmptyGame = (): Game => {
	const user = useLoggedInUser();
	const settings = useGameSettings();
	return {
		// id: '',
		playerId: user?.uid ?? '',
		status: 'BeforeInit',
		score: 0,
		rounds: [],
		settings
	};
};

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

export const getRandomPhrase = async (): Promise<string> => {
	const _tmp = 0;
	return 'this is testphrase';
};

// const initBoard = (phrase: string): BoardState =>
// 	Array.from(phrase).map(c => ({ hidden: true, value: c } as BoardStateTile));
// [...phrase].map(c => ({ hidden: true, value: c } as Field));

export const createBoard = (phrase: string): Board =>
	phrase
		.split(' ')
		.map(word =>
			Array.from(word).map(c => ({ hidden: true, value: c } as BoardTile))
		);
