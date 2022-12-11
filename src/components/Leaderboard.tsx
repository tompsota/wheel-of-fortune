import { Stack, Typography } from '@mui/material';

import LeaderboardTable from './LeaderboardTable';

const Leaderboard = () => (
	<Stack sx={{ display: 'flex', justifyContent: 'center' }}>
		<Typography
			variant="h3"
			sx={{ alignSelf: 'center', mt: '1rem', mb: '2rem' }}
		>
			Leaderboard
		</Typography>
		<LeaderboardTable />
	</Stack>
);

export default Leaderboard;
