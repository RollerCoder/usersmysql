import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Probably need to learn how to create components and place them, size them etc.
        </p>
        <a
          className="App-link"
          href="/nextpage.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React on the next page.
        </a>
      </header>
    </div>
  );
}

export default App;
