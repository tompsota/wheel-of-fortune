import * as React from 'react';
import { FC, PropsWithChildren } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AttractionsIcon from '@mui/icons-material/Attractions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CottageIcon from '@mui/icons-material/Cottage';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Construction from '@mui/icons-material/Construction';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { Container } from '@mui/material';

import useLoggedInUser from '../hooks/useLoggedInUser';
import useGame from '../hooks/useGameTest';
import { getMultiplier, getScore } from '../utils/game';

import AppDrawerListItem from './AppDrawerListItem';

import '../fonts.css';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen
	}),
	overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`
	}
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar
}));

type AppBarProps = {
	open?: boolean;
} & MuiAppBarProps;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme)
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme)
	})
}));

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [activeTab, setActiveTab] = React.useState<number>();

	const changeActiveTab = (index: number) => {
		setActiveTab(index);
	};

	const handleDrawerOpen = () => {
		setDrawerOpen(true);
	};

	const handleDrawerClose = () => {
		setDrawerOpen(false);
	};

	const user = useLoggedInUser();
	const game = useGame();

	let scoreInfo;
	let guessesLeft;
	let timer;

	if (game !== undefined) {
		scoreInfo = `Score: ${getScore(game)} (${getMultiplier(game.settings)}x)`;
		guessesLeft = game.rounds.at(-1)?.guessesLeft;
		timer = game.rounds.at(-1)?.timeLeftOnTimer;
	}

	const displayInfo = game && game.status !== 'Finished';

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				open={drawerOpen}
				sx={{
					background: `linear-gradient(
				    90deg,
        rgba(22, 17, 64, .5) 10%,
        rgba(51, 9, 97, .5) 30%,
        rgba(69, 11, 133, .5) 50%,
				rgba(95, 21, 242, .5) 80%

				)`
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: 5,
							...(drawerOpen && { display: 'none' })
						}}
					>
						<AttractionsIcon />
					</IconButton>
					<Typography
						variant="h6"
						noWrap
						component="div"
						fontFamily="Permanent Marker"
						fontSize="2rem"
					>
						Wheel Of Fortune
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				open={drawerOpen}
				PaperProps={{
					sx: {
						background: `linear-gradient(
        180deg,
        rgba(22, 17, 64, .5) 15%,
        rgba(51, 9, 97, .5) 30%,
        rgba(69, 11, 133, .5) 45%,
        rgba(95, 21, 242, .5) 60%,
        rgba(186, 12, 248, .5) 75%,
        rgba(251, 7, 217, .5) 90%
    )`
					}
				}}
			>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</DrawerHeader>
				<Divider />
				<Container
					disableGutters
					sx={{
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center'
					}}
				>
					<List>
						<AppDrawerListItem
							text="Home"
							open={drawerOpen}
							selected={activeTab === 0}
							icon={<CottageIcon />}
							linkTo="/"
							onClick={() => changeActiveTab(0)}
						/>
						<AppDrawerListItem
							text="Play"
							open={drawerOpen}
							selected={activeTab === 1}
							icon={<SportsEsportsIcon />}
							linkTo="/play"
							onClick={() => changeActiveTab(1)}
						/>
						<AppDrawerListItem
							text="Leaderboard"
							open={drawerOpen}
							selected={activeTab === 2}
							icon={<LeaderboardIcon />}
							linkTo="/leaderboard"
							onClick={() => changeActiveTab(2)}
						/>
						<AppDrawerListItem
							text="Info & Settings"
							open={drawerOpen}
							selected={activeTab === 3}
							icon={<Construction />}
							linkTo="/about"
							onClick={() => changeActiveTab(3)}
						/>

						{!user ? (
							<AppDrawerListItem
								text="Login"
								open={drawerOpen}
								selected={activeTab === 4}
								icon={<LoginIcon />}
								linkTo="/login"
								onClick={() => changeActiveTab(4)}
							/>
						) : (
							<AppDrawerListItem
								text="Logout"
								open={drawerOpen}
								selected={activeTab === 4}
								icon={<LogoutIcon />}
								linkTo="/logout"
								onClick={() => changeActiveTab(4)}
							/>
						)}
					</List>
				</Container>
			</Drawer>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					height: '100vh',
					background:
						'radial-gradient(circle, rgba(76, 45, 107, 1) 0%, rgba(29, 33, 55, 1) 100%)'
				}}
			>
				<Box
					sx={{
						display: 'flex',
						height: '100%',
						flexDirection: 'column',
						justifyContent: 'space-between'
					}}
				>
					<DrawerHeader />
					<Box sx={{ p: 3, flexGrow: 1 }}>{children}</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							py: 0.6,
							px: 2.5,
							background: `linear-gradient(
        90deg,
        rgba(251, 7, 217, .5) 40%,
        rgba(186, 12, 248, .5) 60%,
        rgba(95, 21, 242, .5) 80%,
        rgba(28, 127, 238, .5) 100%
    )`
						}}
					>
						<Typography>{user?.displayName ?? 'Guest'}</Typography>
						{displayInfo && timer && <Typography>{timer}s</Typography>}
						{displayInfo && <Typography>Level {game.rounds.length}</Typography>}
						{displayInfo && guessesLeft && (
							<Typography>Guesses left: {guessesLeft}</Typography>
						)}
						{/* <Typography>Score: {getScore(game)}</Typography> */}
						{displayInfo && <Typography>{scoreInfo}</Typography>}
					</Box>
				</Box>
			</Box>
		</Box>
		// TODO mozno by bolo lepsie pouzit grid nez takto nestovat boxy
	);
};

export default AppLayout;
