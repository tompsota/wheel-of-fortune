import { User } from 'firebase/auth';

type UserProfile = {
	uid: User['uid'];
	avatarUrl: string;
	nickname: string;
};

export default UserProfile;
