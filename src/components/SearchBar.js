import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import "es6-promise/auto";
import SearchResults from './SearchResults';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      results: null,
      relatedValue: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.relatedSearch = this.relatedSearch.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchText = this.state.value;
      const url = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${searchText}`;

        fetch(url)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
        })
        .then((data) => {
          this.handleData(data);
        })
      }
    }

  handleData(data) {
    this.setState({
      results: data
    });

  }

  relatedSearch(data) {
  
  }

  render() {
    let results
    let drugGroup
    if (this.state.results) {
    results = this.state.results
    console.log(results)

      drugGroup = results.drugGroup.conceptGroup[1].conceptProperties.map((drug, index) => {
        return (
          <li key={index}><a onClick={this.relatedSearch}>{drug.synonym}</a></li>
        )
      })
    }

    return (
      <div>
        <form>
           <input
             type="text"
             placeholder="Search..."
             value={this.state.value}
             onChange={this.handleChange}
             onKeyPress={this.handleKeyPress}
           />
         </form>
         {results && <ul>{drugGroup}</ul>}

       </div>
    )
  }
}
