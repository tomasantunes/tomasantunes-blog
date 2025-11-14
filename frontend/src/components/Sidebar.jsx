import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <>
        <div class="sidebar p-3 text-bg-dark" style={{position: "fixed", width: "280px", height: "100vh", left: "0", top: "0", bottom: "0", float: "left"}}>
            <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <span class="fs-4">Blog Administration</span>
            </a>
            <hr />
            <ul class="nav nav-pills flex-column mb-auto gap-2">
                <li class="nav-item">
                    <Link to="/admin" class="btn btn-primary btn-block" aria-current="page">
                    Dashboard
                    </Link>
                </li>
                <li class="nav-item">
                    <Link to="/" class="btn btn-primary btn-block" aria-current="page">
                    Front Page
                    </Link>
                </li>
                <li class="nav-item">
                    <Link to="/admin/posts" class="btn btn-primary btn-block" aria-current="page">
                    Posts
                    </Link>
                </li>
                <li class="nav-item">
                    <Link to="/admin/new-post" class="btn btn-primary btn-block" aria-current="page">
                    New Post
                    </Link>
                </li>
            </ul>
            <hr />
        </div>
    </>
  )
}
