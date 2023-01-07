import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import config from '../config.json';

export default function Blog() {
  const [posts, setPosts] = useState([]);

  function loadPosts() {
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

  useEffect(() => {
    loadPosts();
  }, []);
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Blog</h1>
        {posts.map((post) => (
          <div className="post-list-item">
            <div class="post-header">
              <h2>{post.title}</h2>
              <small>{post.created_at} - {post.tags}</small>
            </div>
            <div className="post-preview" dangerouslySetInnerHTML={{__html: post.content}}></div>
            <hr/>
          </div>
        ))}
      </div>
      
    </>
  )
}
