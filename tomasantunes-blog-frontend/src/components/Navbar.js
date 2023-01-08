import React, {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function changeQuery(e) {
    setQuery(e.target.value);
  }

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      search();
    }
  };

  function search() {
    navigate('/search-results/' + query);
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
          <a className="navbar-brand" href="#">Tomás Antunes</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">Blog</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contact" className="nav-link">Contact</NavLink>
                </li>
            </ul>
            <div className="input-group ms-auto search-box">
              <input type="text" className="form-control" placeholder="Search..." value={query} onChange={changeQuery} onKeyDown={handleKeyDown} />
              <button className="btn btn-outline-primary" type="button" onClick={search}><i className="fa fa-search"></i></button>
            </div>

          </div>
          
      </div>
    </nav>
  )
}
