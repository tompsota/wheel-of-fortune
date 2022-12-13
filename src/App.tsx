import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';

import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import Play from './pages/Play';
import { UserProvider } from './hooks/useLoggedInUser';
import theme from './utils/theme';
import { GameProvider } from './hooks/useGameTest';
import { GameSettingsProvider } from './hooks/useGameSettings';
import InfoSettings from './pages/InfoSettings';
import { GameProviderWrapper } from './components/GameProviderWrapper';

const App = () => {
	const _tmp = 0; //TODO zmazat, je to tu aby nepindal linter
	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider
				maxSnack={3}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				autoHideDuration={1500}
				preventDuplicate
				hideIconVariant
			>
				<QueryClientProvider client={new QueryClient()}>
					<UserProvider>
						<GameSettingsProvider>
							<GameProviderWrapper>
								<GameProvider>
									<BrowserRouter>
										<CssBaseline />
										<AppLayout>
											<Routes>
												<Route path="/" element={<Home />} />
												<Route path="/play" element={<Play />} />
												<Route path="/leaderboard" element={<Leaderboard />} />
												<Route path="/settings" element={<InfoSettings />} />
												<Route path="/login" element={<Login />} />
												<Route path="/logout" element={<Logout />} />
												<Route path="*" element={<NotFound />} />
											</Routes>
										</AppLayout>
									</BrowserRouter>
								</GameProvider>
							</GameProviderWrapper>
						</GameSettingsProvider>
					</UserProvider>
				</QueryClientProvider>
			</SnackbarProvider>
		</ThemeProvider>
	);
};

export default App;
