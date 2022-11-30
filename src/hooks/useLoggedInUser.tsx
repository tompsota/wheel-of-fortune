import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from 'react';
import { User } from 'firebase/auth';

import { onAuthChanged } from '../utils/firebase';

type UserState = [User | undefined, Dispatch<SetStateAction<User | undefined>>];
const UserContext = createContext<UserState>(undefined as never);

// Wrapped context provider
export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
	const localStorageUserString = localStorage.getItem('user');
	// We load user from local storage
	const localStorageUser =
		localStorageUserString === null
			? undefined
			: (JSON.parse(localStorageUserString) as User);

	const userState = useState<User | undefined>(localStorageUser);
	// const userState = useState<User | undefined>(undefined);
	const [_, setUser] = userState;

	// // Setup onAuthChanged once when component is mounted
	useEffect(() => {
		onAuthChanged(u => {
			setUser(u ?? undefined);
			if (u === null) {
				localStorage.removeItem('user');
			} else {
				localStorage.setItem('user', JSON.stringify(u));
			}
		});
	}, []);

	return (
		<UserContext.Provider value={userState}>{children}</UserContext.Provider>
	);
};

// Hook providing logged in user information
const useLoggedInUser = () => {
	const [user, _] = useContext(UserContext);
	return user;
};

export default useLoggedInUser;
