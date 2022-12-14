import { useEffect } from 'react';

// TODO: use hook in pages
const usePageTitle = (title: string) => {
	useEffect(() => {
		document.title = `${title} | Wheel of Fortune`;
	}, [title]);
};

export default usePageTitle;
