import { Box, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { Link } from 'react-router-dom';

import wheel from '../assets/IGT_WOF_wheel.png';
import './Home.css';

const Home = () => (
	<Stack
		sx={{
			display: ' flex',
			alignItems: 'center',
			height: '100%',
			justifyContent: 'space-evenly'
		}}
	>
		<Typography variant="h1" fontWeight="bold">
			Wheeling fortunate?
		</Typography>
		<br />
		<Typography variant="subtitle1">Press the wheel to start</Typography>
		<br />
		<Box component={Link} to="/play">
			<Box
				component="img"
				src={wheel}
				alt="game logo"
				sx={{
					maxWidth: '35rem',
					width: '100%',
					animation: 'rotation 25s infinite linear'
				}}
			/>
			;
		</Box>
	</Stack>
);

export default Home;
