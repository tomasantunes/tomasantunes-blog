import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import config from '../config.json';
import {Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Helmet } from "react-helmet";
import Footer from './Footer';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

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
        setPosts(response.data.data.posts);
        setTotalPages(Math.ceil(response.data.data.count / postsPerPage));
      }
      else {
        MySwal.fire(response.data.error);
      }
    })
    .catch((err) => {
      MySwal.fire("Error loading posts: " + err.message);
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
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-6">
              <div className="post-list-item m-3">
                  {post.image_filename && 
                    <div className="post-preview-image">
                      <img src={"/api/get-file/" + post.image_filename} />
                    </div>
                  }
                  <div className={post.image_filename ? "post-preview-text" : "post-preview-text-fw"}>
                    <div class="post-header">
                      <h2><Link to={"/blog-post/" + post.slug}>{post.post_title}</Link></h2>
                      <small>{post.created_at} - {post.tags}</small>
                    </div>
                    <hr/>
                    <div className="post-summary">{post.summary}</div>
                  </div>
                  <div className="clearfix"></div>
              </div>
            </div>
          ))}
        </div>
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
      <Footer />
    </>
  )
}
