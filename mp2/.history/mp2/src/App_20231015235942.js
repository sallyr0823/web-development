import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {useParams, Route, Routes,Link, BrowserRouter as Router} from 'react-router-dom';
import PropTypes from 'prop-types';
const axios = require('axios');
const API_BASE = 'https://pokeapi.co/api/v2/pokemon';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/pokemon/:id" element={<DetailsView />} />
      </Routes>
    </Router>
  );
}

class Pokenmon extends Component {
  constructor{props} {
    super(props);
    var weburl = "https://pokeapi.co/api/v2/pokemon/";
    
  }
}

export default App;

