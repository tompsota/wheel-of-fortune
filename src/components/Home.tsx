import { Typography } from '@mui/material';
import { Stack } from '@mui/system';

import wheel from '../assets/IGT_WOF_wheel.png';
import './Home.css';

const Home = () => (
	<Stack sx={{ display: ' flex', alignItems: 'center' }}>
		<Typography variant="h1" fontWeight="bold">
			Wheeling fortunate?
		</Typography>
		<img src={wheel} alt="game logo" className="rotate" />
	</Stack>
);

export default Home;
