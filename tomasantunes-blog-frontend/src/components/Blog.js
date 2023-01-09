import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import config from '../config.json';
import {Link} from 'react-router-dom';
import cheerio from 'cheerio';
import ReactPaginate from 'react-paginate';
import { Helmet } from "react-helmet";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const postsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  function loadPosts() {
    axios.get(config.BASE_URL + '/api/get-posts', {
      params: {
        offset: page * postsPerPage, 
        limit: postsPerPage
      }
    })
    .then((response) => {
      if (response.data.status == "OK") {
        var posts_arr = [];
        console.log(response.data.data.posts);
        for (var i in response.data.data.posts) {
          const $ = cheerio.load(response.data.data.posts[i].content);
          $('img').remove();
          posts_arr.push({...response.data.data.posts[i], content: $('*').html()})
        }
        setPosts(posts_arr);
        setTotalPages(Math.ceil(response.data.data.count / postsPerPage));
      }
      else {
        alert(response.data.error);
      }
    })
    .catch((err) => {
      alert(err.message);
    });
  }

  function changePage({ selected }) {
    setPage(selected);
  }

  useEffect(() => {
    loadPosts();
  }, [page]);
  return (
    <>
      <Helmet>
          <title>Tomás Antunes - Blog</title>
          <meta name="description" content="Tomás Antunes Blog - A personal journal and collection of stories" />
          <meta name="keywords" content="tomás antunes, blog, writing, stories, articles, technology, fiction, self-help, art, web development, programming"/>
      </Helmet>
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
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={totalPages}
          onPageChange={changePage}
          containerClassName={"navigationButtons"}
          previousLinkClassName={"previousButton"}
          nextLinkClassName={"nextButton"}
          disabledClassName={"navigationDisabled"}
          activeClassName={"navigationActive"}
        />
      </div>
      
    </>
  )
}
