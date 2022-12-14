import { ExpandLess, ExpandMore, Info } from '@mui/icons-material';
import {
	Box,
	Collapse,
	IconButton,
	Stack,
	Typography,
	useTheme
} from '@mui/material';
import { FC, useState } from 'react';

const About: FC = () => {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const theme = useTheme();

	const handleSettingsOpen = () => {
		setSettingsOpen(o => !o);
	};

	return (
		<Stack
			sx={{
				background: theme.palette.backgroundLight,
				borderRadius: '0.5rem'
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					py: '0.5rem',
					px: '2rem',
					background: theme.palette.backgroundDarker
				}}
			>
				<Box sx={{ display: 'flex', paddingLeft: '0' }}>
					<Info sx={{ alignSelf: 'center' }} />
					<Typography
						sx={{ fontWeight: 'bold', alignSelf: 'center', pl: '1rem' }}
					>
						About
					</Typography>
				</Box>
				<IconButton onClick={handleSettingsOpen}>
					{settingsOpen ? <ExpandLess /> : <ExpandMore />}
				</IconButton>
			</Box>

			<Collapse in={settingsOpen} timeout="auto" unmountOnExit>
				<Stack sx={{ mx: '2rem', my: '1rem' }}>
					<Typography>This is Wheel of Fortune! 🥳</Typography>
					<br />
					<Typography variant="caption">
						Created by Michal Salasek and Tomas Psota for PV247 @FI MUNI
					</Typography>
				</Stack>
			</Collapse>
		</Stack>
	);
};

export default About;
