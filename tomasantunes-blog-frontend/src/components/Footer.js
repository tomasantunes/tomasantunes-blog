import React, {useEffect} from 'react';
import axios from 'axios';
import config from '../config.json';

export default function Footer() {
	useEffect(() => {
		// Log page exit
    document.addEventListener('visibilitychange', function exitPage() {
			var fullUrl = window.location.href;
			if (document.visibilityState == "hidden") {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', config.BASE_URL + "/api/analytics/exit-page?fullUrl=" + fullUrl, false);
				xhr.send(null);
			}
		});
  }, []);

	return (
		<></>
	)
}
