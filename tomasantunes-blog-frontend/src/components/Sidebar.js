import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <>
        <div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{width: "280px", height: "100vh", float: "left"}}>
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
            <div class="dropdown">
                <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <strong>Menu</strong>
                </a>
                <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item" href="#">Log out</a></li>
                </ul>
            </div>
        </div>
    </>
  )
}
