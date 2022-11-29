import { initializeApp } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as authSignOut,
	onAuthStateChanged,
	User,
	signInWithPopup,
	GoogleAuthProvider
} from 'firebase/auth';
import {
	collection,
	CollectionReference,
	doc,
	DocumentReference,
	getFirestore,
	Timestamp
} from 'firebase/firestore';

import { GameStatus } from '../hooks/useGame';

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
export const signUp = (email: string, password: string) =>
	createUserWithEmailAndPassword(auth, email, password);

// Sign in handler
export const signIn = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

// Sign out handler
export const signOut = () => authSignOut(auth);

// Subscribe to auth state changes
export const onAuthChanged = (callback: (u: User | null) => void) =>
	onAuthStateChanged(auth, callback);

const provider = new GoogleAuthProvider();

export const googleSignInWithPopup = () =>
	signInWithPopup(auth, provider)
		.then(result => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			// The signed-in user info.
			const user = result.user;
			// ...
		})
		.catch(error => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});

// Firestore
const db = getFirestore();

// Reviews collection
export type Review = {
	by: string;
	stars: number;
	description?: string;
};

export const reviewsCollection = collection(
	db,
	'reviews'
) as CollectionReference<Review>;

export const reviewsDocument = (id: string) =>
	doc(db, 'reviews', id) as DocumentReference<Review>;

// Games collection
export type Game = {
	result: GameStatus;
	date: Timestamp;
	playerId: string | undefined;
};

export const gamesCollection = collection(
	db,
	'games'
) as CollectionReference<Game>;
