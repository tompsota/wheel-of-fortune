export {};

// import { addDoc, Timestamp } from 'firebase/firestore';
// import { useEffect, useState } from 'react';

// import LetterGuessedResult from '../enums/LetterGuessedResult';
// import Board from '../types/Board';
// import { gamesCollection } from '../utils/firebase';

// import useLoggedInUser from './useLoggedInUser';

// const NUMBER_OF_GUESSES = 5;

// export type Player = 'O' | 'X';
// export type Winner = Player | 'Tie' | undefined;

// const useGame = (initialBoard: Board = []) => {
// 	const user = useLoggedInUser();

// 	const [board, setBoard] = useState(initialBoard);
// 	const [guessesLeft, setGuessesLeft] = useState(NUMBER_OF_GUESSES);
// 	const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
// 	const [gameStatus, setGameStatus] = useState<GameStatus>('Unfinished');
// 	const [phrase, setPhrase] = useState<string>('');
// 	// const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

// 	const initBoard = async () => {
// 		const newPhrase = await getRandomPhrase();
// 		setPhrase(newPhrase);
// 		console.log(`initBoard - phrase: ${newPhrase}`);
// 		const b = createBoard(newPhrase);
// 		setBoard(createBoard(newPhrase));
// 		console.log(`initBoard - created board: ${b}`);
// 	};

// 	// set new phrase whenever game refreshes
// 	// useEffect(() => {
// 	// 	if (!refreshFlag) return;

// 	// 	initBoard();
// 	// 	setRefreshFlag(false);
// 	// }, [refreshFlag]);

// 	// Handlers
// 	const onLetterGuessed = (letter: string): LetterGuessedResult => {
// 		console.log(`letter ${letter} guessed`);
// 		if (guessedLetters.includes(letter)) {
// 			// inform user that he already clicked on that letter?
// 			// maybe disable those letters on on-screen KB?
// 			return LetterGuessedResult.AlreadyGuessed;
// 		}

// 		if (!phrase.includes(letter)) {
// 			// reduce number of guesses left
// 			return LetterGuessedResult.IncorrectLetter;
// 		}

// 		// update board, check if full phrase is guessed
// 		return LetterGuessedResult.CorrectLetter;

// 		console.log(`onLetterGuessed - board: ${board}`);

// 		const updatedBoard = getUpdatedBoard(board, letter);
// 		console.log(`onLetterGuessed - updated board: ${updatedBoard}`);
// 		setBoard(updatedBoard);
// 		// setBoard(getUpdatedBoard(board, letter));
// 		setGuessesLeft(guessesLeft - 1);
// 		setGuessedLetters([...guessedLetters, letter]);

// 		// check for win / if number of guesses left reached 0,
// 		// and handle win / loss
// 	};

// 	const initGameState = () => {
// 		console.log('initGameState called');
// 		setGuessesLeft(NUMBER_OF_GUESSES);
// 		setGuessedLetters([]);
// 		setGameStatus('Unfinished');
// 		// setBoard([]);
// 		initBoard();
// 		// setRefreshFlag(true);
// 	};

// 	// const onRefresh = useCallback(() => {
// 	// 	setGuessesLeft(NUMBER_OF_GUESSES);
// 	// 	setGuessedLetters([]);
// 	// 	setGameStatus('Unfinished');
// 	// 	// setBoard([]);
// 	// 	initBoard();
// 	// 	// setRefreshFlag(true);
// 	// }, []);

// 	// ---------------------- ON MOUNTED ------------------------------------------------
// 	useEffect(() => {
// 		console.log('use game mounted');
// 		initGameState();
// 		// if letter is alpha, then count the press as guess
// 		// IMPORTANT: the event listeners works with state as it was during registration of that listeners,
// 		//    meaning that board is empty (or initialized if it 'had time to be executed'?), and also other
// 		//    will be updated from that initial state
// 		// const listener = (e: KeyboardEvent) => {
// 		// 	// e.preventDefault();
// 		// 	isAlpha(e.key) && onLetterGuessed(e.key);
// 		// };
// 		// document.addEventListener('keydown', listener);
// 		// return () => {
// 		// 	document.removeEventListener('keydown', listener);
// 		// };
// 	}, []);

// 	// Send game result after the game ends
// 	// also user need to be signed in (user !== undefined)
// 	useEffect(() => {
// 		if (gameStatus === 'Unfinished') return;
// 		addDoc(gamesCollection, {
// 			status: gameStatus,
// 			// date: Timestamp.now(),
// 			playerId: user?.uid ?? '',
//       score:
// 		});
// 		// }, [guessesLeft]);
// 	}, [gameStatus]);

// 	return {
// 		board,
// 		phrase,
// 		onLetterGuessed
// 		// onRefresh
// 	};
// };

// // export default useGame;
