import logo from './logo.svg';
import './App.css';
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

class List extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }
}

export default App;
