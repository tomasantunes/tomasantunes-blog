import React, { useRef, useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import config from '../config.json';
import {useParams} from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export default function EditPost() {
  const [postId, setPostId] = useState();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [summary, setSummary] = useState('');
  const [currentPreviewImage, setCurrentPreviewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState();
  const [content, setContent] = useState();
  const params = useParams();
  const quillRef = useRef();
  const navigate = useNavigate();

  function changeTitle(e) {
    setTitle(e.target.value);
  }

  function changeTags(e) {
    setTags(e.target.value);
  }

  function changeSummary(e) {
    setSummary(e.target.value);
  }

  function changePreviewImage(e) {
    setPreviewImage(e.target.files[0]);
  }

  function requestUpdatePost(postId, title, tags, content) {
    var fd = new FormData();
    fd.append('postId', postId);
		fd.append('title', title);
		fd.append('tags', tags);
		fd.append('content', content);
		fd.append('summary', summary);
		fd.append('previewImage', previewImage);
    axios({
			method: "POST",
			url: config.BASE_URL + '/api/update-post',
			data: fd,
			headers: { "Content-Type": "multipart/form-data" },
		})
    .then((response) => {
      if (response.data.status == "OK") {
        MySwal.fire("Post updated successfully");
        navigate("/admin/posts");
      }
      else {
        MySwal.fire(response.data.error);
      }
    })
    .catch((err) => {
      MySwal.fire(err.message);
    });
  }

  function loadPost(post_id) {
    axios.get(config.BASE_URL + '/api/get-post-by-id/' + post_id)
    .then((response) => {
      if (response.data.status == "OK") {
        setTitle(response.data.data.title);
        setTags(response.data.data.tags);
        setContent(response.data.data.content);
        setSummary(response.data.data.summary);
        if (response.data.data.previewImage != null) {
          setCurrentPreviewImage(response.data.data.previewImage.filename);
        }
      }
      else {
        MySwal.fire(response.data.error);
      }
    })
    .catch((err) => {
      MySwal.fire(err.message);
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
			MySwal.fire("Error uploading image");
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

  const modules = useMemo(() => ({
		toolbar:{
			container:[
				[{'header':[1,2,3,4,5,6,false]}],
				['bold','italic','underline'],
				[{'list':'ordered'},{'list':'bullet'}],
				[{'align':[]}],
				['link', 'image'],
				['clean', 'code-block'],
				[{'color':[]}]
			],
			handlers: {
				image: imageHandler
			}
		},
    clipboard: {
      matchVisual: false
    }
	}), [])

  const updatePost = () => {
    requestUpdatePost(postId, title, tags, content);
  };

  useEffect(() => {
    setPostId(params.post_id);
    loadPost(params.post_id);
  }, []);

  return (
    <>
      <Sidebar />
      <div className="p-5" style={{marginLeft: "280px", width: "calc(100% - 280px"}}>
        <h1>Edit Post</h1>
        <div className="form-group mb-2">
          <label>Title</label>
          <input type="text" className="form-control" value={title} onChange={changeTitle} />
        </div>
        <div className="form-group mb-2">
          <label>Summary</label>
          <input type="text" className="form-control" value={summary} onChange={changeSummary} />
        </div>
        <div className="form-group mb-2">
          <label>Tags</label>
          <input type="text" className="form-control" value={tags} onChange={changeTags} />
        </div>
        <div className="form-group mb-2">
          {currentPreviewImage == null ? <p>This post doesn't have a preview image.</p> : (
            <>
              <p>Current Preview Image</p>
              <img src={config.BASE_URL + '/api/get-file/' + currentPreviewImage} /><br />
            </>
          )}
          <label>Change Preview Image</label>
          <input class="form-control" type="file" onChange={changePreviewImage} />
        </div>
        <ReactQuill
          ref={quillRef}
          value={content}
          modules={modules}
          onChange={setContent}
        />
        <div style={{textAlign: "right", marginTop: "20px"}}>
          <button className="btn btn-primary" onClick={updatePost}>Save</button>
        </div>
      </div>
    </>
  )
}

