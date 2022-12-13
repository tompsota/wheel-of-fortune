import { User as AuthUser } from 'firebase/auth';

type User = {
	// authUser: AuthUser;
	id: string;
	email: string | null;
	avatarUrl: string;
	nickname: string;
};

export default User;
