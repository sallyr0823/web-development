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

function ListView() {
  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetch(`${API_BASE}?limit=10`)
      .then(res => res.json())
      .then(data => setPokemonList(data.results))
      .catch(error => console.error('Error fetching Pokémon list:', error));
  }, []);

  const filteredAndSortedPokemon = pokemonList
    .filter(pokemon => pokemon.name.includes(search))
    .sort((a, b) => {
      const keyA = a[sortKey];
      const keyB = b[sortKey];

      if (sortOrder === 'asc') {
        return keyA < keyB ? -1 : 1;
      } else {
        return keyA > keyB ? -1 : 1;
      }
    });

  return (
    <div>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Toggle Sort Order
      </button>
      <select onChange={e => setSortKey(e.target.value)}>
        <option value="name">Name</option>
        <option value="height">Height</option>
      </select>

      <ul>
        {filteredAndSortedPokemon.map(pokemon => (
          <li key={pokemon.name}>
            <Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/gallery">Go to Gallery View</Link>
    </div>
  );
}

function GalleryView() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}?limit=10`)
      .then(res => res.json())
      .then(data => setPokemonList(data.results))
      .catch(error => console.error('Error fetching Pokémon list:', error));
  }, []);

  return (
    <div>
      <h2>Gallery View</h2>
      <div className="gallery">
        {pokemonList.map(pokemon => (
          <Link key={pokemon.name} to={`/pokemon/${pokemon.name}`}>
            <img src={`${API_BASE}/${pokemon.name}/sprites/front_default`} alt={pokemon.name} />
          </Link>
        ))}
      </div>
      <Link to="/">Back to List View</Link>
    </div>
  );
}

function DetailsView() {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Pokemon with ID ${id} not found.`);
        return res.json();
      })
      .then(data => {
        setPokemonData(data);
        setHasError(false);
      })
      .catch(error => {
        console.error('Error fetching Pokémon details:', error);
        setHasError(true);
      });
  }, [id]);

  if (hasError) return <p>Error loading Pokémon details. Please try another ID.</p>;
  if (!pokemonData) return <p>Loading...</p>;

  const currentId = parseInt(id, 10);
  
  return (
    <div>
      <h1>{pokemonData.name.toUpperCase()}</h1>
      <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
      <p>Height: {pokemonData.height}</p>
      <p>Weight: {pokemonData.weight}</p>

      {currentId > 1 && <Link to={`/pokemon/${currentId - 1}`}>PREVIOUS</Link>}
      {/* The NEXT button is a bit more risky since we don't have a hard upper limit. 
           However, we'll allow it but users may run into an error page if the ID does not exist. */}
      <Link to={`/pokemon/${currentId + 1}`}>NEXT</Link>

      <Link to="/">Back to List View</Link>
    </div>
  );
}


DetailsView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default App;

