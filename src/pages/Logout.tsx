import { Typography } from '@mui/material';
import { FC, useEffect } from 'react';

import { signOut } from '../utils/firebase';

const Logout: FC = () => {
	useEffect(() => {
		signOut();
	}, []);

	return <Typography>You have been signed out.</Typography>;
};

export default Logout;
