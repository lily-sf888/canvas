import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import "es6-promise/auto";

import RelatedResults from './RelatedResults';
import SearchResults from './SearchResults';

//parent component where search results and the related medication results get displayed
export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      results: null
  }
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleRelatedSearch = this.handleRelatedSearch.bind(this);
  }
  //storing user input in state
  handleChange(e) {
    this.setState({
      value: e.target.value
    });
  }
  //when user hits enter first fetch will bring back the list of results
  handleKeyPress(e) {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    //clearing related results when user enters new search
    this.setState({
      ingredients: '',
      brandNames: '',
      clinicalNames: ''
    });
    //first fetch to get the list of results
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
        this.handleSearchResult(data);
      })
    }

  //handling the initial search results
  handleSearchResult(data) {
    //make sure data is there if it is parse it and store it in state
    if (!data.drugGroup.conceptGroup) return;
    let dataName = data.drugGroup.conceptGroup[1].conceptProperties

    this.setState({
      results: dataName,
      value: ''
    });

  }
  //when user clicks on one of the search results, we do two fetches in order
  //to get the ingredient, brand name and clinical name of the chosen drug
  handleRelatedSearch(drug) {
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
    //combining the promises we get back, parsing them, and storing them in state
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
         {this.state.results &&
           <SearchResults
             results={this.state.results}
             onSelectDrug={this.handleRelatedSearch}
           />
         }
         {this.state.ingredients &&
           <RelatedResults
             ingredients={this.state.ingredients}
             brandNames={this.state.brandNames}
             clinicalNames={this.state.clinicalNames}
           />
         }
       </div>
    )
  }
}
