import { FC } from 'react';

import About from '../components/About';
import GameSettings from '../components/GameSettings';

// TODO: could add a component for setting username for signed in user (avatarUrl is not used currently)
const InfoSettings: FC = () => (
	<>
		<About />
		<br />
		<GameSettings />
	</>
);

export default InfoSettings;
