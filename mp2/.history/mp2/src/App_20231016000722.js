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
    var pkm = this;
    var url = "https://pokeapi.co/api/v2/pokemon/" + this.props.id;
    // front default image used here
    var img = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + this.props.id + ".png";
    var detail = "/berry/" + this.props.id;
    this.state = {
			image: image,
			url: url,
			id: this.props.id,
			name: this.props.name,
			types: []
		};
    axios.get(pokemonurl).then(function(response) {			
			const types = [];
			response.data.types.forEach(function(element) {
				types.push(element.type.name);
				props.callback(element.type.name);
			});

			pokemon.setState({
				types: types
			});
		});

  };
}

export default App;

