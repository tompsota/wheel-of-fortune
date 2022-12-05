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

import Game from '../types/Game';

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
export const onAuthChanged = (callback: (u: User | null) => void) =>
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
) as CollectionReference<Game>;

export const gameDocument = (id: string) =>
	doc(db, 'games', id) as DocumentReference<Game>;
