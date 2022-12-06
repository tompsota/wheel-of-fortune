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
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { Container } from '@mui/material';
import { Settings } from '@mui/icons-material';

import useLoggedInUser from '../hooks/useLoggedInUser';

import AppDrawerListItem from './AppDrawerListItem';

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

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar position="fixed" open={drawerOpen}>
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
					<Typography variant="h6" noWrap component="div">
						Wheel Of Fortune
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={drawerOpen}>
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
							text="About"
							open={drawerOpen}
							selected={activeTab === 3}
							icon={<InfoIcon />} //TODO add also logout icon once we have state
							linkTo="/about"
							onClick={() => changeActiveTab(3)}
						/>
						<AppDrawerListItem
							text="Settings"
							open={drawerOpen}
							selected={activeTab === 4}
							icon={<Settings />} //TODO add also logout icon once we have state
							linkTo="/settings"
							onClick={() => changeActiveTab(4)}
						/>

						{!user ? (
							<AppDrawerListItem
								text="Login"
								open={drawerOpen}
								selected={activeTab === 5}
								icon={<LoginIcon />}
								linkTo="/login"
								onClick={() => changeActiveTab(5)}
							/>
						) : (
							<AppDrawerListItem
								text="Logout"
								open={drawerOpen}
								selected={activeTab === 5}
								icon={<LoginIcon />}
								linkTo="/logout"
								onClick={() => changeActiveTab(5)}
							/>
						)}
					</List>
				</Container>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
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
							background: 'grey',
							flexDirection: 'row',
							justifyContent: 'space-between',
							py: 0.6,
							px: 2.5
						}}
					>
						<Typography>username</Typography>
						<Typography>Level XX</Typography>
						<Typography>points</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
		// TODO mozno by bolo lepsie pouzit grid nez takto nestovat boxy
	);
};

export default AppLayout;
