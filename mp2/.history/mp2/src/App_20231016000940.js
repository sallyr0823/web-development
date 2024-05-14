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

class Pokemon extends Component {
  constructor(props) {
    super(props);
    var pkmimage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + this.props.id + ".png";
    var pkmurl = "https://pokeapi.co/api/v2/pokemon/" + this.props.id;
    this.state = {
      image: pkmimage,
      url: pkmurl,
      id: props.id,
      name: props.name,
      types: []
    };
  }

  componentDidMount() {
    axios.get(this.state.url)
      .then(response => {
        const types = response.data.types.map(element => element.type.name);
        
        // Ensure callback exists before calling it
        if(this.props.callback) {
          types.forEach(type => this.props.callback(type));
        }
        
        this.setState({
          types: types
        });
      })
      .catch(error => console.error('Error fetching Pokémon types:', error));
  }

  render() {
  }
}
export default App;

