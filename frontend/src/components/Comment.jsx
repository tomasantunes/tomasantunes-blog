import React, {useState} from 'react';
import axios from 'axios';
import config from '../config';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export default function Comment(props) {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [commentAuthor, setCommentAuthor] = useState("");
	const [commentContent, setCommentContent] = useState("");
	const [comment, setComment] = useState(props.comment);

	function toggleReplyForm() {
		setShowReplyForm(!showReplyForm);
	}

	function changeCommentAuthor(e) {
		setCommentAuthor(e.target.value);
	}

	function changeCommentContent(e) {
		setCommentContent(e.target.value);
	}

	function submitComment(e) {
		var data = {
			post_id: comment.post_id,
			parent_id: e.target.value,
			author: commentAuthor,
			content: commentContent
		}
		axios.post(config.BASE_URL + '/api/add-comment', data)
		.then((response) => {
			if (response.data.status == "OK") {
				MySwal.fire("Comment added successfully");
				window.location.reload();
			}
			else {
				MySwal.fire(response.data.error);
			}
		})
		.catch((err) => {
			MySwal.fire(err.message);
		});
	}

  return (
		<>
			<div className="comment">
				<small>{comment.author}</small>
				<div>{comment.content}</div>
				<div style={{textAlign: "right"}}>
					<small>{comment.created_at}</small>
					<button className="btn btn-primary mx-3" onClick={toggleReplyForm}>Reply</button>
				</div>
				{showReplyForm && <div className="comment-form">
					<h3>Reply</h3>
					<br />
					<input className="form-control" type="text" value={commentAuthor} onChange={changeCommentAuthor} placeholder="Your name" />
					<br />
					<textarea className="form-control" value={commentContent} onChange={changeCommentContent} placeholder="Your comment" rows={8}></textarea>
					<br />
					<div style={{textAlign: "right"}}>
						<button className="btn btn-primary" value={comment.id} onClick={submitComment}>Submit</button>
					</div>
				</div>}
			</div>
			<div className="comment-replies">
				{comment.children.length > 0 && comment.children.map((child) => {
					return <Comment comment={child} />
				})}
			</div>
		</>
  )
}
