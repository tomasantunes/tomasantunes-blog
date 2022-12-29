import React from 'react';

export default function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
          <a class="navbar-brand" href="#">Tomás Antunes</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                <a class="nav-link" href="#">Blog</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="#">About</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="#">Contact</a>
                </li>
            </ul>
            <div class="input-group ms-auto search-box">
              <input type="text" class="form-control" placeholder="Search..."/>
              <button class="btn btn-outline-primary" type="button"><i className="fa fa-search"></i></button>
            </div>

          </div>
          
      </div>
    </nav>
  )
}
