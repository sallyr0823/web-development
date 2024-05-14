import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';

import Detail from './components/Detail/Detail.js';
import Gallery from './components/Gallery/Gallery.js';
import List from './components/List/List.js';

import './index.css';
import reportWebVitals from './reportWebVitals';


const App = () => (
  <Router>
      <div>
          <h3>Popular Movies</h3>
          <div className = "navcontainer">
              <p className="nav-link"><NavLink exact to='/'><span>Search</span></NavLink></p>
              <p className="nav-link"><NavLink to='/gallery'><span>Gallery</span></NavLink></p>
          </div>
          <Routes>
                <Route path="/" element={<List />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/detail/:id" element={<Detail />} />
            </Routes>
      </div>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();