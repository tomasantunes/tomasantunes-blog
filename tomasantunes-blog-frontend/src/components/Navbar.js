import React from 'react'

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
            <form class="d-flex ms-auto" role="search">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
          
      </div>
    </nav>
  )
}
