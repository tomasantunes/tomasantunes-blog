import React from 'react';
import NavBar from './Navbar';

export default function Contact() {
  return (
    <>
      <NavBar />
      <div className="container">
        <h2>Contact</h2>
        <p><b>Email: </b> eu@tomasantunes.com</p>
        <div className="social-media-icons">
          <a href="https://www.facebook.com/tomasantunes123"><i class="fa-brands fa-facebook"></i></a>
          <a href="https://www.linkedin.com/in/tomasantunes/"><i class="fa-brands fa-linkedin"></i></a>
        </div>
      </div>
    </>
  )
}
