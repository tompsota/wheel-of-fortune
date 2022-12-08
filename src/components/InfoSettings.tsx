import { FC } from 'react';

import About from './About';
import GameSettings from './GameSettings';

const InfoSettings: FC = () => (
	<>
		<About />
		<br />
		<GameSettings />
	</>
);

export default InfoSettings;
