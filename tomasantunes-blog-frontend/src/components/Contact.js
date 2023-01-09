import React from 'react';
import NavBar from './Navbar';
import { Helmet } from "react-helmet";
import Footer from './Footer';

export default function Contact() {
  return (
    <>
      <Helmet>
          <title>Tomás Antunes - Contact</title>
          <meta name="keywords" content="tomás antunes, blog, contact, e-mail, facebook, linkedin"/>
      </Helmet>
      <NavBar />
      <div className="container">
        <h2>Contact</h2>
        <p><b>Email: </b> eu@tomasantunes.com</p>
        <div className="social-media-icons">
          <a href="https://www.facebook.com/tomasantunes123"><i class="fa-brands fa-facebook"></i></a>
          <a href="https://www.linkedin.com/in/tomasantunes/"><i class="fa-brands fa-linkedin"></i></a>
        </div>
      </div>
      <Footer />
    </>
  )
}
