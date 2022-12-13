import { Stack, Typography } from '@mui/material';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import Game from '../types/Game';
import {
	gameFromDto,
	gamesCollection,
	getUserByIdDB,
	getUserDB
} from '../utils/firebase';
import LeaderboardTable from '../components/LeaderboardTable';
import GameWithPlayer from '../types/GameWithPlayer';

const Leaderboard = () => {
	const [games, setGames] = useState<GameWithPlayer[]>();

	useEffect(() => {
		// Call onSnapshot() to listen to changes
		const unsubscribe = onSnapshot(gamesCollection, async snapshot => {
			// Access .docs property of snapshot
			const games = await Promise.all(
				snapshot.docs.map(async doc => {
					const game = { ...gameFromDto(doc.data()), id: doc.id };
					const user =
						game.playerId === null ? null : await getUserByIdDB(game.playerId);
					return { ...game, player: user };
				})
			);
			setGames(games);
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
				<LeaderboardTable games={games} />
			)}
		</Stack>
	);
};

export default Leaderboard;
