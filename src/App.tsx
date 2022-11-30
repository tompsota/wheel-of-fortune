import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import About from './components/About';
import AppLayout from './components/AppLayout';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import Play from './components/Play';
import { UserProvider } from './hooks/useLoggedInUser';
import theme from './utils/theme';

const App = () => {
	const _tmp = 0; //TODO zmazat, je to tu aby nepindal linter
	return (
		<ThemeProvider theme={theme}>
			<UserProvider>
				<BrowserRouter>
					<CssBaseline />
					<AppLayout>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/play" element={<Play />} />
							<Route path="/leaderboard" element={<Leaderboard />} />
							<Route path="/about" element={<About />} />
							<Route path="/login" element={<Login />} />
							<Route path="/logout" element={<Logout />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</AppLayout>
				</BrowserRouter>
			</UserProvider>
		</ThemeProvider>
	);
};

export default App;
