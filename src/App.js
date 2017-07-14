import React, { Component } from 'react';
import './App.css';
import SearchBar from './components/SearchBar'

class App extends Component {
  render() {
    return (
      <div className="search">
        <h1>Related RX Search</h1>
        <SearchBar />
      </div>
    );
  }
}

export default App;
