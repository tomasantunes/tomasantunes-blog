import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Sidebar from './Sidebar';
import axios from 'axios';
import config from '../config.json';

export default function NewPost() {
  const editorRef = useRef(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

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
      }
      else {
        alert(response.data.error);
      }
    })
    .catch((err) => {
      alert(err.message);
    });
  }

  const submitPost = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      requestSubmitPost(title, tags, editorRef.current.getContent());
    }
  };

  return (
    <>
      <Sidebar />
      <div className="p-5" style={{marginLeft: "280px", width: "calc(100% - 280px"}}>
        <h1>New Post</h1>
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
          initialValue=""
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
          <button className="btn btn-primary" onClick={submitPost}>Submit</button>
        </div>
      </div>
    </>
  )
}
