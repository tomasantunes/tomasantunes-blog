import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Blog from './components/Blog';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
      </Routes>
    </Router>
  );
}

export default App;
