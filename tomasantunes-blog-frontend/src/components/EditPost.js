import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Sidebar from './Sidebar';
import axios from 'axios';
import config from '../config.json';
import {useParams} from 'react-router-dom';

export default function EditPost() {
  const editorRef = useRef(null);
  const [postId, setPostId] = useState();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const params = useParams();

  function changeTitle(e) {
    setTitle(e.target.value);
  }

  function changeTags(e) {
    setTags(e.target.value);
  }

  function changeContent(e) {
    setContent(e.target.value);
  }

  function requestUpdatePost(title, tags, content) {
    var data = {
      title,
      tags,
      content
    }
    axios.post(config.BASE_URL + '/api/add-post', data)
    .then((response) => {
      if (response.data.status == "OK") {
        alert("Post submitted successfully");
      }
      else {
        alert(response.data.error);
      }
    })
    .catch((err) => {
      alert(err.message);
    });
  }

  function loadPost(post_id) {
    axios.get(config.BASE_URL + '/api/get-post-by-id/' + post_id)
    .then((response) => {
      console.log(response.data);
      if (response.data.status == "OK") {
        setTitle(response.data.data.title);
        setTags(response.data.data.tags);
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

  const updatePost = () => {
    if (editorRef.current) {
      requestUpdatePost(title, tags, content);
    }
  };

  useEffect(() => {
    console.log(params.post_id);
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
          <label>Tags</label>
          <input type="text" className="form-control" value={tags} onChange={changeTags} />
        </div>
        <Editor
          onInit={(evt, editor) => editorRef.current = editor}
          value={content}
          onChange={changeContent}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
        <div style={{textAlign: "right", marginTop: "20px"}}>
          <button className="btn btn-primary" onClick={updatePost}>Save</button>
        </div>
      </div>
    </>
  )
}

