import { Grid, Typography } from '@mui/material';

import Board from './Board';
import Keyboard from './Keyboard';

const Play = () => (
	<Grid container direction="column" sx={{ flexGrow: 1, height: '100%' }}>
		<Grid item xs={5}>
			{/* <Typography>Play component</Typography> */}
			<Board />
		</Grid>
		<Grid item xs={7}>
			<Keyboard />
		</Grid>
	</Grid>
);

export default Play;
