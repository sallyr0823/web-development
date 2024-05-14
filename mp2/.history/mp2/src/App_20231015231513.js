import React, { Component } from 'react';
import 'App.scss';
import { Navbar } from 'react-bootstrap';
import { Redirect, Route, NavLink, BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

const axios = require('axios');

class PokemonComponent extends Component {
	constructor(props) {
		super(props);
		var image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + this.props.id + ".png";
		var url = "/detail/" + this.props.id;
		var pokemonurl = "https://pokeapi.co/api/v2/pokemon/" + this.props.id;
		var pokemon = this;
		
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
	}

	render() {
		function click(event) {
	  		console.log(event.target.getAttribute("pokemon"));
	  	}

	  	const types = [];
		if (this.state.types == undefined) {
			this.state.types = [];
		}

		this.state.types.forEach(function(element) {
			if (element == "grass" || element == "bug") {
				types.push(
					<><span class="badge badge-pill badge-success">{element}</span>&nbsp;</>	
				);
			} else if (element == "poison" || element == "ground") {
				types.push(
					<><span class="badge badge-pill badge-warning">{element}</span>&nbsp;</>	
				);
			} else if (element == "fire" || element == "fighting") {
				types.push(
					<><span class="badge badge-pill badge-danger">{element}</span>&nbsp;</>	
				);
			} else if (element == "normal" || element == "ice") {
				types.push(
					<><span class="badge badge-pill badge-info">{element}</span>&nbsp;</>	
				);
			} else if (element == "flying" || element == "water") {
				types.push(
					<><span class="badge badge-pill badge-primary">{element}</span>&nbsp;</>	
				);
			} else if (element == "dark") {
				types.push(
					<><span class="badge badge-pill badge-dark">{element}</span>&nbsp;</>	
				);
			} else {
				types.push(
					<><span class="badge badge-pill badge-secondary">{element}</span>&nbsp;</>	
				);
			}
		});

		if (!this.state.types.includes(this.props.filtertype) && this.props.filtertype != "all") {
			return <></>;
		} else {
			return (
				<div className="col-sm-4 col-md-3 col-lg-2">
					<NavLink to={this.state.url} class="nounderline">
				  	  <div className="card mt-4" onClick={click} pokemon={this.state.id}>
				  	  	<img src={this.state.image} class="card-img-top" alt="..." pokemon={this.state.id} />
				  	  	<div class="card-body text-center" pokemon={this.state.id}>
						    <h5 class="card-title pokename" pokemon={this.state.id}>{this.state.name}</h5>
						    <p className="card-text">{types}</p>
						</div>
				  	  </div>
				  	</NavLink>
				</div>
			);
		}
	}
}

class Grid extends Component {
	constructor(props) {
	  	super(props);
	    this.state = {pokemon: [], types: [], filtertype: "all"};
	  	var grid = this;
	  	
		axios.get('https://pokeapi.co/api/v2/pokemon?limit=24')
			.then(function(response) {
				const pokemon = [];
				response.data.results.forEach(function(element) {
					var id = element.url.substr(34);
					id = id.substr(id, id.length - 1);
					pokemon.push({
						name: element.name,
						id: id
					})
				});
				grid.setState({pokemon: pokemon});
			});
	}



  render() {
  	var t = this;
  	function addType(type) {
  		var types = t.state.types;
  		if(!types.includes(type)) types.push(type);
  		t.setState({types: types});
  	}

	const items = [];
	const pokemon = this.state.pokemon;
	const filtertype = this.state.filtertype;

	pokemon.forEach(function(element) {
		items.push(
				<PokemonComponent id={element.id} name={element.name} callback={addType} filtertype={filtertype} />
			);
	});

	var options = [];

	this.state.types.forEach(function(element) {
		options.push(
				<option>{element}</option>
			);
	});

	var a = this;
  	function handleChange(event) {
  		console.log("User chose to filter by " + event.target.value);
  		a.setState({filtertype: event.target.value});
  	}

	return (
		<div>
			<select class="form-control form-control-lg mt-4" onChange={handleChange}>
				<option>all</option>
				{options}
			</select>
			<div className="row">
				{items}
			</div>
		</div>
    );
  }
}

class List extends Component {
  constructor(props) {
  	super(props);
    this.state = {pokemon: [], search: "", redirect: 0};
  	var grid = this;
  	this.handleChange = this.handleChange.bind(this);
  	
		axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000')
		.then(function(response) {
			const pokemon = [];
			response.data.results.forEach(function(element) {
				var id = element.url.substr(34);
				id = id.substr(id, id.length - 1);
				pokemon.push({
					name: element.name,
					id: id
				})
			});
			grid.setState({pokemon: pokemon});
		});
  	}

  	handleChange(event) {
  		console.log(event.target.value);
  		this.setState({search: event.target.value});
  	}

	render() {
		var t = this;
	  	function clickHandler(event) {
			 t.setState({
			 	redirect: event.target.getAttribute("pokemon")
			 });
	  	}

		const items = []

		const pokemon = this.state.pokemon;
		var search = this.state.search.toLowerCase();

		var results = 0;
		const redir = [];

		if(this.state.redirect != 0) {
			var url = "/detail/" + this.state.redirect;
			redir.push(<Redirect to={url} />);
		}

		pokemon.forEach(function(element) {
			var url = "/detail/" + element.id;
			const name = element.name.toLowerCase();
			if(element.id > 10000) {
			} else if(results < 10 && (search === "" || name.includes(search))) {
				results++;
				var front = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + element.id + ".png";
				var back = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/" + element.id + ".png";
				items.push(<tr onClick={clickHandler} pokemon={element.id}>
						      <td pokemon={element.id} className="align-middle"><img pokemon={element.id} src={front} alt="" /></td>
						      <td pokemon={element.id} className="align-middle"><img pokemon={element.id} src={back} alt="" /></td>
						      <td pokemon={element.id} className="align-middle pokename">{element.name}</td>
						      <th pokemon={element.id} className="align-middle" scope="row">{element.id}</th>
						   </tr>);
			} else {
				var front = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + element.id + ".png";
				var back = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/" + element.id + ".png";
				items.push(<tr class="hidden">
						      <td className="align-middle"><img alt="" /></td>
						      <td className="align-middle"><img alt="" /></td>
						      <td className="align-middle pokename">{element.name}</td>
						      <th className="align-middle" scope="row">{element.id}</th>
						   </tr>);
			}
		});

		if(results === 0) {
			var text = "No pokemon matching " + this.state.search + "!";
			items.push(<tr>
						      <td colspan="4">{text}</td>
						   </tr>);
		}

		return (
			<div class="res-mwidth">
				{redir}
				<div class="input-group flex-nowrap">
				  <div class="input-group-prepend">
				    <span class="input-group-text" id="addon-wrapping"><i class="fas fa-search"></i></span>
				  </div>
				  <input type="text" class="form-control" id="search" placeholder="Search" aria-label="Username" aria-describedby="addon-wrapping" onChange={this.handleChange}/>
				</div>
				<div class="items">
					<table class="table table-hover" id="table">
					  <thead class="thead-dark">
					    <tr>
					      <th scope="col" class="cimg">Image (Front)</th>
					      <th scope="col" class="cimg">Image (Back)</th>
					      <th scope="col">Name</th>
					      <th scope="col">Pokemon ID</th>
					    </tr>
					  </thead>
					  <tbody>
					    {items}
					  </tbody>
					</table>
				</div>
			</div>
		);
	}
}

class App extends Component {
  render() {
    return (
      <>
    	<Navbar bg="dark" variant="dark">
        	<Navbar.Brand href="#home">Pokedex</Navbar.Brand>      
      	</Navbar>

		<div className="container">
      		
		<nav className="mt-4">
		  <div className="nav nav-tabs justify-content-center" id="nav-tab" role="tablist">
		    <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Gallery</a>
		    <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Search</a>
		  </div>
		</nav>
		<div className="tab-content" id="nav-tabContent">
		  <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"><Grid></Grid></div>
		  <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"><List></List></div>
		</div>

      	</div>
      </>
    );
  }
}

App.propTypes = {
	id: PropTypes.number,
	name: PropTypes.string,
	callback: PropTypes.func,
	filtertype: PropTypes.string
}

export default App;