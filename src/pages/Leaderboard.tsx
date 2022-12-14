import { Stack, Typography } from '@mui/material';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { gameFromDto, getUserById, leaderboardQuery } from '../utils/firebase';
import LeaderboardTable from '../components/LeaderboardTable';
import GameWithPlayer from '../types/GameWithPlayer';

const Leaderboard = () => {
	const [games, setGames] = useState<GameWithPlayer[]>();

	// get all games with players included
	useEffect(() => {
		const unsubscribe = onSnapshot(leaderboardQuery, async snapshot => {
			const games = await Promise.all(
				snapshot.docs.map(async doc => {
					const game = { ...gameFromDto(doc.data()), id: doc.id };
					const user =
						game.playerId === null ? null : await getUserById(game.playerId);
					return { ...game, player: user };
				})
			);
			setGames(games);
		});
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
				Leaderboard 🏆
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
