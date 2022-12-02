import { useEffect } from 'react';

const usePageTitle = (title: string) => {
	useEffect(() => {
		document.title = `${title} | Wheel of Fortune`;
	}, [title]);
};

export default usePageTitle;
