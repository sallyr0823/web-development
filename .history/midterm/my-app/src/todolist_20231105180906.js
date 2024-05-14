import logo from './logo.svg';
import React from 'react';
import './App.css';
import List from  './list.js'

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['laundry', 'dishes', 'homework'],
      input: ''
    };
  }

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page
    if (!this.state.input) return; // Prevent adding empty items

    this.setState(prevState => ({
      items: prevState.items.concat(this.state.input),
      input: '' // Clear the input field after submission
    }));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            value={this.state.input} 
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


