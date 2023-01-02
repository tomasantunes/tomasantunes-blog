import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Blog from './components/Blog';
import About from './components/About';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Login from './components/Login';
import Posts from './components/Posts';
import NewPost from './components/NewPost';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/posts" element={<Posts />} />
        <Route path="/admin/new-post" element={<NewPost />} />
      </Routes>
    </Router>
  );
}

export default App;
