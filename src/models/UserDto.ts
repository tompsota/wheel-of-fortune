import User from '../types/User';

type UserDto = Omit<User, 'authUser'>;

export default UserDto;
