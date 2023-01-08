import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import Navbar from './Navbar';
import config from '../config.json';

export default function BlogPost() {
  const params = useParams();
	const [slug, setSlug] = useState("");
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState("");
	const [content, setContent] = useState("");
	const [createdAt, setCreatedAt] = useState("");

	function loadPost(slug) {
		axios.get(config.BASE_URL + '/api/get-post-by-slug/' + slug)
		.then((response) => {
			if (response.data.status == "OK") {
				setTitle(response.data.data.title);
				setTags(response.data.data.tags);
				setCreatedAt(response.data.data.created_at);
				setContent(response.data.data.content);
			}
			else {
				alert(response.data.error);
			}
		})
		.catch((err) => {
			alert(err.message);
		});
	}

	useEffect(() => {
		console.log(params.slug);
		setSlug(params.slug);
		loadPost(params.slug);
	}, []);

  return (
		<>
			<Navbar />
    	<div className="container">
				<div className="post">
					<div class="post-header">
						<h2>{title}</h2>
						<small>{createdAt} - {tags}</small>
					</div>
					<hr/>
					<div dangerouslySetInnerHTML={{__html: content}}></div>
					<hr/>
        </div>
			</div>
		</>
  )
}
