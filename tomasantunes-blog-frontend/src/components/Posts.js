import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import config from '../config';
import axios from 'axios';
import Sidebar from './Sidebar';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  function loadPosts() {
    setPosts([]);
    axios.get(config.BASE_URL + '/api/get-posts')
    .then((response) => {
      if (response.data.status == "OK") {
        setPosts(response.data.data);
      }
      else {
        alert(response.data.error);
      }
    })
    .catch((err) => {
      alert(err.message);
    });
  }

  function editPost(e) {
    navigate("/admin/edit-post/" + e.target.value);
  }

  function deletePost(e) {
    axios.post(config.BASE_URL + "/api/delete-post", {post_id: e.target.value})
    .then((response) => {
      if (response.data.status == "OK") {
        alert("Post deleted successfully!");
        loadPosts();
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
    loadPosts();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="p-5" style={{marginLeft: "280px", width: "calc(100% - 280px"}}>
          <div className="row">
              <h1>Posts</h1>
              <table className="table table-striped">
                  <thead>
                      <tr>
                          <th style={{width: "90%"}}>Title</th>
                          <th style={{width: "10%"}}>Options</th>
                      </tr>
                  </thead>
                  <tbody>
                      {posts.map((post) => (
                        <tr>
                          <td>{post.title}</td>
                          <td>
                            <button className="btn btn-success m-1" value={post.id} onClick={editPost}>Edit</button>
                            <button className="btn btn-danger m-1" value={post.id} onClick={deletePost}>Delete</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </>
  )
}
