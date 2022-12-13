import User from '../types/User';

type UserDto = Omit<User, 'id'>;

export default UserDto;
