import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Blog from './components/Blog';
import About from './components/About';
import Contact from './components/Contact';
import Admin from './components/Admin';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
