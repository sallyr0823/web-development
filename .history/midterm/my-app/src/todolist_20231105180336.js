import logo from './logo.svg';
import React from 'react';
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

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  }

  handleSubmit = (e) => {
    this.setState(prevState => ({
      items: [...prevState.items, prevState.input],
      input: ''
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


