import { User as AuthUser } from 'firebase/auth';

type User = {
	authUser: AuthUser;
	avatarUrl: string;
	nickname: string;
};

export default User;
