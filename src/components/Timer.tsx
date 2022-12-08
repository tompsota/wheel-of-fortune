import { Typography } from '@mui/material';
import { FC } from 'react';

type Props = {
	seconds: number;
};

// not used at the moment
const Timer: FC<Props> = ({ seconds }) => <Typography>{seconds}s</Typography>;

export default Timer;
