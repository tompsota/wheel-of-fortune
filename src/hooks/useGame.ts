import { addDoc, Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import { gamesCollection } from '../utils/firebase';

import useLoggedInUser from './useLoggedInUser';

const NUMBER_OF_GUESSES = 5;

export type Player = 'O' | 'X';
export type Winner = Player | 'Tie' | undefined;

export type BoardStateTile = {
	value: string | undefined;
	hidden: boolean;
};

export type BoardStateRow = BoardStateTile[];
export type BoardState = BoardStateRow[];

export type GameStatus = 'Win' | 'Loss' | 'Unfinished';

// const isPhraseSolved = (board: BoardState): boolean =>
// 	board.every(field => field.hidden === false || field.value === undefined);

const isPhraseSolvedRow = (board: BoardState): boolean =>
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

const getUpdatedBoard = (board: BoardState, letter: string): BoardState =>
	board.map(row => getUpdatedRow(row, letter));

const getUpdatedRow = (row: BoardStateRow, letter: string): BoardStateRow =>
	row.map(field =>
		field.hidden || field.value === undefined || field.value !== letter
			? field
			: { ...field, hidden: false }
	);

const getRandomPhrase = async (): Promise<string> => {
	const _tmp = 0;
	return 'this is testphrase';
};

// const initBoard = (phrase: string): BoardState =>
// 	Array.from(phrase).map(c => ({ hidden: true, value: c } as BoardStateTile));
// [...phrase].map(c => ({ hidden: true, value: c } as Field));

const createBoard = (phrase: string): BoardState =>
	phrase
		.split(' ')
		.map(word =>
			Array.from(word).map(c => ({ hidden: true, value: c } as BoardStateTile))
		);

const useGame = (initialBoard: BoardState = []) => {
	const user = useLoggedInUser();

	const [board, setBoard] = useState(initialBoard);
	const [guessesLeft, setGuessesLeft] = useState(NUMBER_OF_GUESSES);
	const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
	const [gameStatus, setGameStatus] = useState<GameStatus>('Unfinished');
	const [phrase, setPhrase] = useState<string>('');
	const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

	const initBoard = async () => {
		const newPhrase = await getRandomPhrase();
		setPhrase(newPhrase);
		console.log(`initBoard - phrase: ${newPhrase}`);
		const b = createBoard(newPhrase);
		setBoard(createBoard(newPhrase));
		console.log(`initBoard - created board: ${b}`);
	};

	// set new phrase whenever game refreshes
	// useEffect(() => {
	// 	if (!refreshFlag) return;

	// 	initBoard();
	// 	setRefreshFlag(false);
	// }, [refreshFlag]);

	// Handlers
	const onLetterGuessed = (letter: string) => {
		console.log(`letter ${letter} guessed`);
		if (guessedLetters.includes(letter)) {
			// inform user that he already clicked on that letter?
			// maybe disable those letters on on-screen KB?
			return;
		}

		console.log(`onLetterGuessed - board: ${board}`);

		const updatedBoard = getUpdatedBoard(board, letter);
		console.log(`onLetterGuessed - updated board: ${updatedBoard}`);
		setBoard(updatedBoard);
		// setBoard(getUpdatedBoard(board, letter));
		setGuessesLeft(guessesLeft - 1);
		setGuessedLetters([...guessedLetters, letter]);

		// check for win / if number of guesses left reached 0,
		// and handle win / loss
	};

	const initGameState = () => {
		console.log('initGameState called');
		setGuessesLeft(NUMBER_OF_GUESSES);
		setGuessedLetters([]);
		setGameStatus('Unfinished');
		// setBoard([]);
		initBoard();
		// setRefreshFlag(true);
	};

	// const onRefresh = useCallback(() => {
	// 	setGuessesLeft(NUMBER_OF_GUESSES);
	// 	setGuessedLetters([]);
	// 	setGameStatus('Unfinished');
	// 	// setBoard([]);
	// 	initBoard();
	// 	// setRefreshFlag(true);
	// }, []);

	const alphaChars = 'abcdefghijklmnopqrstuvwxyz'.split('');
	const isAlpha = (c: string): boolean => alphaChars.includes(c);

	// ---------------------- ON MOUNTED ------------------------------------------------
	useEffect(() => {
		console.log('use game mounted');
		initGameState();
		// if letter is alpha, then count the press as guess
		// IMPORTANT: the event listeners works with state as it was during registration of that listeners,
		//    meaning that board is empty (or initialized if it 'had time to be executed'?), and also other
		//    will be updated from that initial state
		const listener = (e: KeyboardEvent) => {
			isAlpha(e.key) && onLetterGuessed(e.key);
		};
		document.addEventListener('keydown', listener);
		return () => {
			document.removeEventListener('keydown', listener);
		};
	}, []);

	// Send game result after the game ends
	// also user need to be signed in (user !== undefined)
	useEffect(() => {
		if (gameStatus === 'Unfinished') return;
		addDoc(gamesCollection, {
			result: gameStatus,
			date: Timestamp.now(),
			playerId: user?.uid
		});
	}, [guessesLeft]);

	return {
		board,
		phrase,
		onLetterGuessed
		// onRefresh
	};
};

export default useGame;
