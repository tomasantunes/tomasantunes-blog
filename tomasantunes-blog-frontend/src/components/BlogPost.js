import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import Navbar from './Navbar';
import config from '../config.json';
import Comment from './Comment';

export default function BlogPost() {
  const params = useParams();
	const [slug, setSlug] = useState("");
	const [postId, setPostId] = useState();
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState("");
	const [content, setContent] = useState("");
	const [createdAt, setCreatedAt] = useState("");
	const [comments, setComments] = useState([]);
	const [commentAuthor, setCommentAuthor] = useState("");
	const [commentContent, setCommentContent] = useState("");

	function loadPost(slug) {
		axios.get(config.BASE_URL + '/api/get-post-by-slug/' + slug)
		.then((response) => {
			if (response.data.status == "OK") {
				setPostId(response.data.data.id);
				setTitle(response.data.data.title);
				setTags(response.data.data.tags);
				setCreatedAt(response.data.data.created_at);
				setContent(response.data.data.content);
				loadComments(response.data.data.id);
			}
			else {
				alert(response.data.error);
			}
		})
		.catch((err) => {
			alert(err.message);
		});
	}

	function submitComment() {
		var data = {
			post_id: postId,
			parent_id: 0,
			author: commentAuthor,
			content: commentContent
		}
		axios.post(config.BASE_URL + '/api/add-comment', data)
		.then((response) => {
			if (response.data.status == "OK") {
				alert("Comment added successfully");
				setCommentAuthor("");
				setCommentContent("");
				loadComments(postId);
			}
			else {
				alert(response.data.error);
			}
		})
		.catch((err) => {
			alert(err.message);
		});
	}

	function loadComments(post_id) {
		axios.get(config.BASE_URL + '/api/get-comments/' + post_id)
		.then((response) => {
			if (response.data.status == "OK") {
				console.log(response.data.data);
				setComments(response.data.data);
			}
			else {
				alert(response.data.error);
			}
		})
		.catch((err) => {
			alert(err.message);
		});
	}

	function changeCommentAuthor(e) {
		setCommentAuthor(e.target.value);
	}

	function changeCommentContent(e) {
		setCommentContent(e.target.value);
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
				<div className="comment-form">
					<h3>Leave a comment</h3>
					<br />
					<input type="text" className="form-control" value={commentAuthor} onChange={changeCommentAuthor} placeholder="Your name" />
					<br />
					<textarea className="form-control" value={commentContent} onChange={changeCommentContent} placeholder="Your comment" rows={8}></textarea>
					<br />
					<div style={{textAlign: "right"}}>
						<button className="btn btn-primary" onClick={submitComment}>Submit</button>
					</div>
				</div>
				<div className="comments">
					{comments.map((comment) => (
						<Comment comment={comment} />
					))}
				</div>
			</div>
		</>
  )
}
