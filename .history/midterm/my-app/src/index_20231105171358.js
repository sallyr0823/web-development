
import ReactDOM from 'react-dom/client';
import './index.css';
import TodoList from './TodoList.js';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<TodoList />);


reportWebVitals();