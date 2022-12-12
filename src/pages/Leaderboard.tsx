import { Box, Stack, Typography } from '@mui/material';
import { onSnapshot } from 'firebase/firestore';
import { useState, useEffect, FC } from 'react';

import Game from '../types/Game';
import { gameFromDto, gamesCollection } from '../utils/firebase';

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
		<Stack>
			<Typography>Leaderboard component</Typography>
			{games === undefined || games.length === 0 ? (
				<Typography>No games.</Typography>
			) : (
				// games.map(<LeaderboardGame game={game}  />)
				<Typography>{games.length} games played</Typography>
			)}
		</Stack>
	);
};

// type props = {
// 	game: Game;
// 	i: number;
// };

// const LeaderboardGame: FC<props> = ({ game, i }) => {
// 	// <Stack key={game.id ?? i.toString()}>
// 	{
// 		/* <Typography>Played by: {game.playerId}</Typography> */
// 	}
// 	return <Typography>Started at: {game.startedAt}</Typography>;
// 	// </Stack>
// };

export default Leaderboard;
