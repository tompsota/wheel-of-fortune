import { Button, Divider, Grid } from '@mui/material';
import { Stack } from '@mui/system';

import Board from './Board';
import Keyboard from './Keyboard';

const Play = () => (
	<Grid container direction="column" sx={{ display: 'flex', height: '100%' }}>
		<Grid item xs={6}>
			<Board />
		</Grid>
		<Grid item xs={6}>
			<Stack sx={{ display: 'flex', height: '100%' }}>
				<Divider />
				<Keyboard />
				<Button sx={{ alignSelf: 'flex-end' }} disabled>
					Next level
				</Button>
			</Stack>
		</Grid>
	</Grid>
);

export default Play;
