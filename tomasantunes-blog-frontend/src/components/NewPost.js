import React, { useRef, useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import config from '../config.json';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useNavigate} from 'react-router-dom';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState();
  const quillRef = useRef();
	const navigate = useNavigate();

  function changeTitle(e) {
		setTitle(e.target.value);
  }

  function changeTags(e) {
	setTags(e.target.value);
  }

  function requestSubmitPost(title, tags, content) {
		var data = {
			title,
			tags,
			content
		}
		axios.post(config.BASE_URL + '/api/add-post', data)
		.then((response) => {
			if (response.data.status == "OK") {
				alert("Post submitted successfully");
				navigate('/admin/posts');
			}
			else {
				alert(response.data.error);
			}
		})
		.catch((err) => {
			alert(err.message);
		});
  }

	function uploadFile(uploadFileObj){
		var fd = new FormData();
		fd.append('image', uploadFileObj);

		axios({
			method: "POST",
			url: config.BASE_URL + '/api/upload-image',
			data: fd,
			headers: { "Content-Type": "multipart/form-data" },
		})
		.then((response)=>{
			console.log(response.data);
			var filename = response.data.data.filename;
			const range = quillRef.current.getEditorSelection();
			var image_url = config.BASE_URL + '/api/get-file/' + filename;
			quillRef.current.getEditor().insertEmbed(range.index, 'image', image_url);
		}).catch((error) => {
			console.log(error);
			alert("Error uploading image");
		});
	}
	
	function imageHandler(){
    const input = document.createElement('input');
    
    input.setAttribute('type','file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = function() {
			var file = input.files[0];
			uploadFile(file);
    }
	}

  const submitPost = () => {
		requestSubmitPost(title, tags, content);
  };

	const modules = useMemo(() => ({
		toolbar:{
			container:[
				[{'header':[1,2,3,4,5,6,false]}],
				['bold','italic','underline'],
				[{'list':'ordered'},{'list':'bullet'}],
				[{'align':[]}],
				['link', 'image'],
				['clean'],
				[{'color':[]}]
			],
			handlers: {
				image: imageHandler
			}
		}
	}), [])

	useEffect(() => {
    const init = (quill) => {};
    const check = () => {
      if (quillRef.current) {
        init(quillRef.current);
        return;
      }
      setTimeout(check, 200);
    };
    check();
  }, [quillRef]);

  return (
		<>
			<Sidebar />
			<div className="p-5" style={{marginLeft: "280px", width: "calc(100% - 280px"}}>
			<h1>New Post</h1>
			<div className="form-group mb-2">
				<label>Title</label>
				<input type="text" className="form-control" value={title} onChange={changeTitle} />
			</div>
			<div className="form-group mb-4">
				<label>Tags</label>
				<input type="text" className="form-control" value={tags} onChange={changeTags} />
			</div>
			
			<ReactQuill
				ref={quillRef}
				value={content}
				modules={modules}
				onChange={setContent}
			/>
			<div style={{textAlign: "right", marginTop: "20px"}}>
				<button className="btn btn-primary" onClick={submitPost}>Submit</button>
			</div>
			</div>
		</>
  )
}
