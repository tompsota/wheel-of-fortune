import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as authSignOut,
	onAuthStateChanged,
	User as AuthUser,
	signInWithPopup,
	GoogleAuthProvider
} from 'firebase/auth';
import {
	addDoc,
	collection,
	CollectionReference,
	doc,
	DocumentReference,
	getDoc,
	getDocs,
	getFirestore,
	limit,
	orderBy,
	query,
	setDoc,
	Timestamp,
	where
} from 'firebase/firestore';

import BoardDto from '../models/BoardDto';
import GameDto from '../models/GameDto';
import GameRoundDto from '../models/GameRoundDto';
import UserDto from '../models/UserDto';
import Board from '../types/Board';
import Game from '../types/Game';
import GameRound from '../types/GameRound';
import User from '../types/User';

// Initialize Firebase
initializeApp({
	apiKey: 'AIzaSyAFo_zVyOqxrNwjwDOLLBpGDnVqcR1CU8g',
	authDomain: 'wheel-of-fortune-8fe8d.firebaseapp.com',
	projectId: 'wheel-of-fortune-8fe8d',
	storageBucket: 'wheel-of-fortune-8fe8d.appspot.com',
	messagingSenderId: '66219308351',
	appId: '1:66219308351:web:af85d79af3b5ed85adcf8a'
});

// Authentication
const auth = getAuth();

// Sign up handler
// TODO: create UserProfile
export const signUp = (email: string, password: string) =>
	createUserWithEmailAndPassword(auth, email, password);

// Sign in handler
export const signIn = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

// Sign out handler
export const signOut = () => authSignOut(auth);

// Subscribe to auth state changes
export const onAuthChanged = (callback: (u: AuthUser | null) => void) =>
	onAuthStateChanged(auth, callback);

const provider = new GoogleAuthProvider();
// TODO: create profile for first sign-in
export const googleSignInWithPopup = () =>
	signInWithPopup(auth, provider)
		.then(result => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const _token = credential?.accessToken;
			// The signed-in user info.
			const _user = result.user;
			// ...
		})
		.catch(error => {
			// Handle Errors here.
			const _errorCode = error.code;
			const _errorMessage = error.message;
			// The email of the user's account used.
			const _email = error.customData.email;
			// The AuthCredential type that was used.
			const _credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});

// Firestore
const db = getFirestore();

export const gamesCollection = collection(
	db,
	'games'
) as CollectionReference<GameDto>;

export const gameDocument = (id: string) =>
	doc(db, 'games', id) as DocumentReference<GameDto>;

export const gameFromDto = (gameDto: GameDto): Game => ({
	...gameDto,
	rounds: gameDto.rounds.map(gameRoundFromDto)
});

const gameRoundFromDto = (gameRoundDto: GameRoundDto): GameRound => ({
	...gameRoundDto,
	board: boardFromDto(gameRoundDto.board)
});

const boardFromDto = (boardDto: BoardDto): Board =>
	Object.keys(boardDto).map(key => boardDto[key]);

export const gameToDto = (game: Game): GameDto => ({
	...game,
	rounds: game.rounds.map(gameRoundToDto)
});

const gameRoundToDto = (gameRound: GameRound): GameRoundDto => ({
	...gameRound,
	board: boardToDto(gameRound.board)
});

const boardToDto = (board: Board): BoardDto =>
	Object.fromEntries(
		board.map((boardRow, index) => [index.toString(), boardRow])
	);

// export const saveGame = (game: Game) => {
// 	const originalStatus = game.status;
// 	// localStorage.setItem('game', JSON.stringify(game));
// 	game.status = originalStatus;
// };

// TODO: change to async
// could get id as well
export const upsertGameDB = (
	game: Game,
	setGame: (value: React.SetStateAction<Game | undefined>) => void
) => {
	if (game.id === undefined) {
		addDoc(gamesCollection, gameToDto(game)).then(doc => {
			game.id = doc.id;
			console.log(`game created, id: ${doc.id}`);
			// setGame(game);
		});
	} else {
		setDoc(gameDocument(game.id), gameToDto(game));
		console.log(`game updated, id: ${game.id}`);
	}
};

// we get player's last game - if the status === InProgress, it is the current unfinished game
//  - game is updated after each successful round (InProgress), or after the game has finished
// CURRENT (POSSIBLE) ISSUE: when we update gamesCollection (add a round / end game and create empty one),
//   does the change force a re-render? or since we don't use subscription, the query only gets evaluated once,
//   and the re-render only happens when status changes from loading to success?
//   - because ideally we only want to fetch from DB at the beginning (at the mount of GameContextProvider),
//     and update the GameContext manually
export const getPlayersGameInProgress = (
	playerId: AuthUser['uid'] | undefined
): Game | undefined => {
	playerId = playerId ?? '0';
	const lastGameQuery = query(
		gamesCollection,
		where('playerId', '==', playerId),
		orderBy('startedAt', 'desc'),
		limit(1)
	);

	// we also need to get document.id and assign to game.id ?
	// const { data, status, error } = useFirestoreQuery<Game>(lastGameQuery);
	// if (status === 'success' && (data as Game).status === 'InProgress') {
	// 	return data;
	// }

	// const { data, status, error } = useFirestoreQuery(['lastPlayerGame'], lastGameQuery);

	const queryResult = useFirestoreQuery(['lastPlayerGame'], lastGameQuery);

	if (!queryResult.isSuccess) {
		return undefined;
	}

	const snapshot = queryResult.data;

	const games = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
	// console.log(`fetched player's games: ${JSON.stringify(games)}`);

	if (games.length === 0) {
		return undefined;
	}

	const game = gameFromDto(games[0]);
	if (game.status === 'Finished') {
		return undefined;
	}

	// console.log(`returning recent game: ${JSON.stringify(game)}`);
	return game;
};

export const getPlayersGameInProgressTest = (
	playerId: AuthUser['uid'] | undefined,
	setGame: (value: React.SetStateAction<Game | undefined>) => void
) => {
	const lastGameQuery = query(
		gamesCollection,
		where('playerId', '==', playerId),
		orderBy('startedAt', 'desc'),
		limit(1)
	);

	// we also need to get document.id and assign to game.id ?
	// const { data, status, error } = useFirestoreQuery<Game>(lastGameQuery);
	// if (status === 'success' && (data as Game).status === 'InProgress') {
	// 	return data;
	// }

	// const { data, status, error } = useFirestoreQuery(['lastPlayerGame'], lastGameQuery);

	const queryResult = useFirestoreQuery(['lastPlayerGame'], lastGameQuery);

	if (!queryResult.isSuccess) {
		setGame(undefined);
		return;
		// return undefined;
	}

	const snapshot = queryResult.data;

	const games = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
	// console.log(`fetched player's games: ${JSON.stringify(games)}`);

	if (games.length === 0) {
		setGame(undefined);
		return;
		// return undefined;
	}

	const game = gameFromDto(games[0]);
	if (game.status === 'Finished') {
		setGame(undefined);
		return;
		// return undefined;
	}

	// console.log(`returning recent game: ${JSON.stringify(game)}`);
	setGame(game);
	// return game;
};

export const usersCollection = collection(
	db,
	'users'
) as CollectionReference<UserDto>;

export const userDocument = (id: string) =>
	doc(db, 'users', id) as DocumentReference<UserDto>;

// export const getUserDB = (authUser: AuthUser): User => ({
// 	...userDocument(authUser.uid),
// });

export const getUserDB = async (authUser: AuthUser): Promise<User> => {
	const userDoc = userDocument(authUser.uid);
	const docSnap = await getDoc(userDoc);

	if (docSnap.exists()) {
		return { ...docSnap.data(), id: authUser.uid };
	}

	const userDto = {
		nickname: authUser.displayName ?? authUser.email ?? 'Anonymous user',
		avatarUrl:
			authUser.photoURL ??
			'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
		email: authUser.email
	};
	await setDoc(userDoc, userDto);
	return { ...userDto, id: authUser.uid };
};

export const getUserByIdDB = async (userId: string): Promise<User> => {
	const userDoc = userDocument(userId);
	const docSnap = await getDoc(userDoc);

	if (docSnap.exists()) {
		return { ...docSnap.data(), id: userId };
	}

	return {
		id: userId,
		nickname: 'Anonymous user',
		avatarUrl:
			'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
		email: null
	};
};

// const userDocRef =
//    const doc = await userDocRef.get();
//    if (!doc.exists) {
//      console.log('No such document exista!');
//    } else {
//      console.log('Document data:', doc.data());
//    }

export const getPlayersGameInProgressAsync = async (
	playerId: AuthUser['uid'] | undefined
): Promise<Game | undefined> => {
	if (playerId === undefined) {
		return undefined;
	}

	const lastGameQuery = query(
		gamesCollection,
		where('playerId', '==', playerId),
		orderBy('startedAt', 'desc'),
		limit(1)
	);

	// we also need to get document.id and assign to game.id ?
	// const { data, status, error } = useFirestoreQuery<Game>(lastGameQuery);
	// if (status === 'success' && (data as Game).status === 'InProgress') {
	// 	return data;
	// }

	// const { data, status, error } = useFirestoreQuery(['lastPlayerGame'], lastGameQuery);

	const querySnapshot = await getDocs(lastGameQuery);

	if (querySnapshot.empty) {
		return undefined;
	}

	const games = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
	// console.log(`fetched player's games: ${JSON.stringify(games)}`);

	if (games.length === 0) {
		return undefined;
		// return undefined;
	}

	const game = gameFromDto(games[0]);
	if (game.status === 'Finished') {
		return undefined;
		// return undefined;
	}

	// console.log(`returning recent game: ${JSON.stringify(game)}`);
	return game;
};
