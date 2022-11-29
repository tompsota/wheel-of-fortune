import { addDoc, Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { gamesCollection } from '../utils/firebase';

import useLoggedInUser from './useLoggedInUser';

const NUMBER_OF_GUESSES = 5;

export type Player = 'O' | 'X';
export type Winner = Player | 'Tie' | undefined;

type TileValue = string | undefined;

export type Tile = {
	value: string | undefined;
	hidden: boolean;
};

type Row = Tile[];
export type BoardState = Tile[];

export type GameStatus = 'Win' | 'Loss' | 'Unfinished';

const isPhraseSolved = (board: BoardState): boolean =>
	board.every(field => field.hidden === false || field.value === undefined);

// const transformedBoardState = (board: BoardState)

// uncover letters
// TODO: in general, make sure uppercase/lowercase is handled properly
const getUpdatedBoard = (board: BoardState, letter: string): BoardState => {
	const updatedBoard = board.map(field =>
		field.value === letter ? { ...field, hidden: false } : field
	);
	return updatedBoard;
};

const getRandomPhrase = async (): Promise<string> => {
	const _tmp = 0;
	return 'test';
};

const initBoard = (phrase: string): BoardState =>
	Array.from(phrase).map(c => ({ hidden: true, value: c } as Tile));
// [...phrase].map(c => ({ hidden: true, value: c } as Field));

const useGame = (initialBoard: BoardState = []) => {
	const user = useLoggedInUser();

	const [board, setBoard] = useState(initialBoard);
	const [guessesLeft, setGuessesLeft] = useState(NUMBER_OF_GUESSES);
	const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
	const [gameStatus, setGameStatus] = useState<GameStatus>('Unfinished');
	const [phrase, setPhrase] = useState<string>('');
	const [refreshFlag, setRefreshFlag] = useState<boolean>(true);

	// set new phrase whenever game refreshes
	useEffect(() => {
		if (!refreshFlag) return;
		(async () => {
			const newPhrase = await getRandomPhrase();
			setPhrase(newPhrase);
		})();

		initBoard(phrase);
		setRefreshFlag(false);
	}, [refreshFlag]);

	// Handlers
	const onLetterGuessed = (letter: string) => {
		if (guessedLetters.includes(letter)) {
			// inform user that he already clicked on that letter?
			// maybe disable those letters on on-screen KB?
			return;
		}

		setBoard(getUpdatedBoard(board, letter));
		setGuessesLeft(guessesLeft - 1);

		// check for win / if number of guesses left reached 0,
		// and handle win / loss
	};

	const onRefresh = useCallback(() => {
		setGuessesLeft(NUMBER_OF_GUESSES);
		setGuessedLetters([]);
		setGameStatus('Unfinished');
		setBoard([]);
		setRefreshFlag(true);
	}, []);

	// Register 'keydown' listener that restarts the game
	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			e.key === 'r' && onRefresh();
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
		onLetterGuessed,
		onRefresh
	};
};

export default useGame;
