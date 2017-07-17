import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import "es6-promise/auto";
import SearchResults from './SearchResults';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      results: null
  }
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.relatedSearch = this.relatedSearch.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
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
    if (!data.drugGroup.conceptGroup) return;
    let dataName = data.drugGroup.conceptGroup[1].conceptProperties

    this.setState({
      results: dataName,
      value: ''
    });

  }

  relatedSearch(drug) {
    const urlIngredients = `https://rxnav.nlm.nih.gov/REST/rxcui/${drug.rxcui}/related.json?tty=IN`;
    const urlBrandnames = `https://rxnav.nlm.nih.gov/REST/rxcui/${drug.rxcui}/related.json?tty=SCD+SBD`;

    const promiseIngredients = fetch(urlIngredients)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      });
    const promiseBrandnames = fetch(urlBrandnames)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })

    Promise.all([promiseIngredients, promiseBrandnames]).then((values) => {
      const ingredients = values[0].relatedGroup.conceptGroup[0].conceptProperties;
      const brandNames = values[1].relatedGroup.conceptGroup[0].conceptProperties;
      const clinicalNames = values[1].relatedGroup.conceptGroup[1].conceptProperties;

      this.setState({
        ingredients,
        brandNames,
        clinicalNames
      });

    });
  }

  render() {
    const results = this.state.results;
    const drugGroup =  results ? results.map((drug, index) => {
      return (
        <li key={index}><a onClick={() => this.relatedSearch(drug)}>{drug.synonym}</a></li>
      )
     }) : null;

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

         {results && <div><h2>Search Results</h2><ul>{drugGroup}</ul></div>}
         {this.state.ingredients &&
           <div>
             <SearchResults
               ingredients={this.state.ingredients}
               brandNames={this.state.brandNames}
               clinicalNames={this.state.clinicalNames}
             />
          </div>
          }
       </div>
    )
  }
}
