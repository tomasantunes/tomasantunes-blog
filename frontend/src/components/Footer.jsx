import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config.json';

export default function Footer() {
	const [pageEntryDone, setPageEntryDone] = useState(false);
	useEffect(() => {
		// Log page entry. NOTE: AdBlockers may block this.
		if (!pageEntryDone) {
			var fullUrl = window.location.href;
			axios.get(config.BASE_URL + "/api/analytics/page-entry?fullUrl=" + fullUrl + "&referrer=" + document.referrer)
			.then(function (response) {
				console.log(response.data);
			})
			.catch(function (err) {
				console.log(err.message);
			});
			setPageEntryDone(true);
		}

		// Log page exit. NOTE: AdBlockers may block this.
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
