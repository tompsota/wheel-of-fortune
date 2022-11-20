import {
	AppBar,
	Container,
	CssBaseline,
	ThemeProvider,
	Toolbar,
	Typography
} from '@mui/material';
import React from 'react';

import { AppDrawer } from './components/AppDrawer';
import theme from './utils/theme';

const App = () => {
	const _tmp = 0;
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />

			<AppBar
				sx={{
					top: 0,
					position: 'relative',
					zIndex: theme.zIndex.drawer + 1
				}}
			>
				<Toolbar disableGutters sx={{ gap: 5 }}>
					<Typography sx={{ paddingLeft: 3 }}>Wheel Of Fortune</Typography>
				</Toolbar>
			</AppBar>
			<AppDrawer />
			<Container
				maxWidth="sm"
				component="main"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					flexGrow: 1,
					gap: 2,
					py: 2
				}}
			/>
		</ThemeProvider>
	);
};

export default App;
