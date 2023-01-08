import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Login from './components/Login';
import Posts from './components/Posts';
import NewPost from './components/NewPost';
import EditPost from './components/EditPost';
import SearchResults from './components/SearchResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/blog-post/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search-results/:query" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/posts" element={<Posts />} />
        <Route path="/admin/new-post" element={<NewPost />} />
        <Route path="/admin/edit-post/:post_id" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;
