import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import config from '../config.json';
import {Link} from 'react-router-dom';
import cheerio from 'cheerio';

export default function Blog() {
  const [posts, setPosts] = useState([]);

  function loadPosts() {
    axios.get(config.BASE_URL + '/api/get-posts')
    .then((response) => {
      if (response.data.status == "OK") {
        var posts_arr = [];
        for (var i in response.data.data) {
          const $ = cheerio.load(response.data.data[i].content);
          $('img').remove();
          posts_arr.push({...response.data.data[i], content: $('*').html()})
        }
        setPosts(posts_arr);
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
              <h2><Link to={"/blog-post/" + post.slug}>{post.title}</Link></h2>
              <small>{post.created_at} - {post.tags}</small>
            </div>
            <hr/>
            <div className="post-preview" dangerouslySetInnerHTML={{__html: post.content}}></div>
            <hr/>
          </div>
        ))}
      </div>
      
    </>
  )
}
