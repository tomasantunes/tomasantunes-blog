import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import config from '../config';
import axios from 'axios';
import Sidebar from './Sidebar';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [checkedState, setCheckedState] = useState([]);
  const navigate = useNavigate();

  function loadPosts() {
    setPosts([]);
    axios.get(config.BASE_URL + '/api/get-all-posts')
    .then((response) => {
      if (response.data.status == "OK") {
        setPosts(response.data.data);
        setCheckedState(new Array(response.data.data.length).fill(false));
        setPostCount(response.data.data.length);
      }
      else {
        MySwal.fire(response.data.error);
      }
    })
    .catch((err) => {
      MySwal.fire(err.message);
    });
  }

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  function deleteChecked() {
    var post_ids = [];
    for (var i in checkedState) {
      if (checkedState[i]) {
        post_ids.push(posts[i].id);
      }
    }
    for (var i in post_ids) {
      axios.post(config.BASE_URL + "/api/delete-post", {post_id: post_ids[i]})
      .then((response) => {
        if (response.data.status == "OK") {
          loadPosts();
        }
        else {
          MySwal.fire(response.data.error);
        }
      })
      .catch((err) => {
        MySwal.fire(err.message);
      });
    }
  }

  function editPost(e) {
    navigate("/admin/edit-post/" + e.target.value);
  }

  function deletePost(e) {
    axios.post(config.BASE_URL + "/api/delete-post", {post_id: e.target.value})
    .then((response) => {
      if (response.data.status == "OK") {
        MySwal.fire("Post deleted successfully!");
        loadPosts();
      }
      else {
        MySwal.fire(response.data.error);
      }
    })
    .catch((err) => {
      MySwal.fire(err.message);
    });
  }

  function exportToWiki() {
    axios.post(config.BASE_URL + "/api/export-to-wiki")
    .then((response) => {
      if (response.data.status == "OK") {
        MySwal.fire("Posts exported to wiki successfully!");
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
    loadPosts();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="p-5" style={{marginLeft: "280px", width: "calc(100% - 280px"}}>
          <div className="row">
              <h1>Posts</h1>
              <div style={{textAlign: "right"}}>
                <p>Total posts: {postCount.toString()}</p>
                <button className="btn btn-danger me-2" onClick={deleteChecked}>Delete Checked</button>
                <button className="btn btn-primary" onClick={exportToWiki}>Export to Wiki</button>
              </div>
              <table className="table table-striped">
                  <thead>
                      <tr>
                          <th style={{width: "10%"}}>Check</th>
                          <th style={{width: "80%"}}>Title</th>
                          <th style={{width: "10%"}}>Options</th>
                      </tr>
                  </thead>
                  <tbody>
                      {posts.map((post, index) => (
                        <tr key={index}>
                          <td><input type="checkbox" checked={checkedState[index]} onChange={() => handleOnChange(index)}/></td>
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
