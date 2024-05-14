import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate} from 'react-router-dom';
import { Image} from 'semantic-ui-react';
import PropTypes from 'prop-types'
import './App.css';
import List from  './list.js'

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['laundry', 'dishes', 'homework'],
      inputValue: ''
    };
  }

  handleChange = (event) => {
    this.setState({ inputValue: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState(prevState => ({
      items: [...prevState.items, prevState.inputValue],
      inputValue: ''
    }));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            value={this.state.inputValue} 
            onChange={this.handleChange} 
          />
          <button type="submit">Submit</button>
        </form>
        <List items={this.state.items} />
      </div>
    );
  }
}
export default TodoList;


