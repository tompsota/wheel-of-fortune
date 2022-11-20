import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end'
}));

export const AppDrawer: React.FC = () => {
	const theme = useTheme();

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0
			}}
			PaperProps={{
				sx: {
					width: drawerWidth,
					boxSizing: 'border-box',
					justifyContent: 'center'
				}
			}}
			variant="permanent"
			anchor="left"
		>
			<List>
				{['Home', 'Play', 'About', 'Leaderboard'].map((text, index) => (
					<ListItem key={text} disablePadding sx={{ paddingTop: 6 }}>
						<ListItemButton>
							<ListItemIcon>
								{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Drawer>
	);
};
