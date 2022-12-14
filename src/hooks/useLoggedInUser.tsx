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

import User from '../types/User';
import { getUser, onAuthChanged } from '../utils/firebase';

type UserState = [User | undefined, Dispatch<SetStateAction<User | undefined>>];
const UserContext = createContext<UserState>(undefined as never);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
	const localStorageUserString = localStorage.getItem('user');
	// We load user from local storage
	const localStorageUser =
		localStorageUserString === null
			? undefined
			: (JSON.parse(localStorageUserString) as User);

	const userState = useState<User | undefined>(localStorageUser);
	const [_, setUser] = userState;

	// // Setup onAuthChanged once when component is mounted
	useEffect(() => {
		onAuthChanged(authUser => {
			if (authUser === null) {
				setUser(undefined);
				localStorage.removeItem('user');
			} else {
				(async () => {
					const user = await getUser(authUser);
					setUser(user);
					localStorage.setItem('user', JSON.stringify(user));
				})();
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
