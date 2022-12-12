import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Palette {
		backgroundLight?: string;
		backgroundDarker?: string;
	}
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface PaletteOptions {
		backgroundLight?: string;
		backgroundDarker?: string;
	}
}

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: { main: '#854dff', light: '#a672d6', dark: '#673199' },
		secondary: { main: '#f2d45c', light: '#fff7d6', dark: '#b59309' },
		info: { main: '#0377fc' },
		backgroundLight: 'rgba(255, 255, 255, 0.1)',
		backgroundDarker: 'rgba(255, 255, 255, 0.05)'
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				// Css rule that makes sure app is always 100% height of window
				'body, #root': {
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh'
				}
			}
		}
	}
});

export default theme;
