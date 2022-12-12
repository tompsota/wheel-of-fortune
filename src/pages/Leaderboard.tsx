import { Stack, Typography } from '@mui/material';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import Game from '../types/Game';
import { gameFromDto, gamesCollection } from '../utils/firebase';
import LeaderboardTable from '../components/LeaderboardTable';

const Leaderboard = () => {
	const [games, setGames] = useState<Game[]>();

	useEffect(() => {
		// Call onSnapshot() to listen to changes
		const unsubscribe = onSnapshot(gamesCollection, snapshot => {
			// Access .docs property of snapshot
			setGames(
				snapshot.docs.map(doc => ({ ...gameFromDto(doc.data()), id: doc.id }))
			);
		});
		// Don't forget to unsubscribe from listening to changes
		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<Stack sx={{ display: 'flex', justifyContent: 'center' }}>
			<Typography
				variant="h3"
				sx={{ alignSelf: 'center', mt: '1rem', mb: '2rem' }}
			>
				Leaderboard
			</Typography>
			{games === undefined || games.length === 0 ? (
				<Typography sx={{ alignSelf: 'center', mt: '1rem', mb: '2rem' }}>
					No games.
				</Typography>
			) : (
				<LeaderboardTable />
			)}
		</Stack>
	);
};

export default Leaderboard;
