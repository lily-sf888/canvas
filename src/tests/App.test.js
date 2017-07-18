import React from 'react';
import ReactDOM from 'react-dom';

import App from '../App';
import RelatedResults from '../components/RelatedResults';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('Related Search Results Renders', () => {
  const div = document.createElement('div');
  const mockListing = {
    name: "testName"
  };
  ReactDOM.render(<RelatedResults
    ingredients={[mockListing]}
    brandNames={[mockListing]}
    clinicalNames={[mockListing]}
  />, div);
});

it('Search Bar Renders', () => {
  const div = document.createElement('div');
  const mockListing = {
    name: "testName"
  }
  ReactDOM.render(<SearchBar
    value={[mockListing]}
    onChange={[mockListing]}
    onKeyPress={[mockListing]}
  />, div);
});

it('Search Results Renders', () => {
  const div = document.createElement('div');
  const mockListing = {
    name: "testName"
  }
  ReactDOM.render(<SearchResults
    results={[mockListing]}
    onSelectDrug={[mockListing]}
  />, div);
});
