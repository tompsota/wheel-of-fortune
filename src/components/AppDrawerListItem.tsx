import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	SvgIconProps
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FC, ReactElement } from 'react';

type Props = {
	text: string;
	open: boolean;
	selected: boolean;
	icon: ReactElement<SvgIconProps>;
	linkTo: string;
	onClick: () => void;
};

const AppDrawerListItem: FC<Props> = ({
	text,
	open,
	selected,
	icon,
	linkTo,
	onClick
}) => (
	<ListItem disablePadding sx={{ display: 'block' }}>
		<ListItemButton
			selected={selected}
			component={Link}
			to={linkTo}
			onClick={onClick}
			sx={{
				minHeight: 48,
				justifyContent: open ? 'initial' : 'center',
				px: 2.5,
				py: 7
			}}
		>
			<ListItemIcon
				sx={{
					minWidth: 0,
					mr: open ? 3 : 'auto',
					justifyContent: 'center'
				}}
			>
				{icon}
			</ListItemIcon>
			<ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
		</ListItemButton>
	</ListItem>
);

export default AppDrawerListItem;
