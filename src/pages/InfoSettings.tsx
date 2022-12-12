import { FC } from 'react';

import About from '../components/About';
import GameSettings from '../components/GameSettings';

const InfoSettings: FC = () => (
	<>
		<About />
		<br />
		<GameSettings />
	</>
);

export default InfoSettings;
