import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Navbar from './Navbar';
import config from '../config.json';
import Comment from './Comment';
import { Helmet } from "react-helmet";
import Footer from './Footer';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export default function BlogPost() {
  const params = useParams();
	const navigate = useNavigate();
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
				MySwal.fire(response.data.error);
			}
		})
		.catch((err) => {
			MySwal.fire(err.message);
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
				MySwal.fire("Comment added successfully");
				setCommentAuthor("");
				setCommentContent("");
				loadComments(postId);
			}
			else {
				MySwal.fire(response.data.error);
			}
		})
		.catch((err) => {
			MySwal.fire(err.message);
		});
	}

	function loadComments(post_id) {
		axios.get(config.BASE_URL + '/api/get-comments/' + post_id)
		.then((response) => {
			if (response.data.status == "OK") {
				setComments(response.data.data);
			}
			else {
				MySwal.fire(response.data.error);
			}
		})
		.catch((err) => {
			MySwal.fire(err.message);
		});
	}

	function changeCommentAuthor(e) {
		setCommentAuthor(e.target.value);
	}

	function changeCommentContent(e) {
		setCommentContent(e.target.value);
	}

	function previousPost() {
		axios.get(config.BASE_URL + "/api/previous-post", {
			params: {
				post_id: postId
			}
		})
		.then((response) => {
			if (response.data.status == "OK") {
				navigate(response.data.data);
				navigate(0);
			}
			else {
				MySwal.fire(response.data.error);
			}
		})
		.catch((err) => {
			MySwal.fire(err.message);
		});
	}

	function nextPost() {
		axios.get(config.BASE_URL + "/api/next-post", {
			params: {
				post_id: postId
			}
		})
		.then((response) => {
			if (response.data.status == "OK") {
				navigate(response.data.data);
				navigate(0);
			}
			else {
				MySwal.fire(response.data.error);
			}
		})
		.catch((err) => {
			MySwal.fire(err.message);
		});
	}

	useEffect(() => {
		setSlug(params.slug);
		loadPost(params.slug);
	}, []);

  return (
		<>
			<Helmet>
          <title>{title}</title>
          <meta name="keywords" content={tags} />
      </Helmet>
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
					<div style={{textAlign: "right"}}>
						<button className="btn btn-outline-secondary mx-2" onClick={previousPost}>Previous</button>
						<button className="btn btn-outline-secondary mx-2" onClick={nextPost}>Next</button>
					</div>
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
			<Footer />
		</>
  )
}
