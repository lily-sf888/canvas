import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import "es6-promise/auto";
import RelatedResults from './RelatedResults';
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
    this.handleClick = this.handleClick.bind(this);
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
      //clearing related results when user enters new search
      this.setState({
        ingredients: '',
        brandNames: '',
        clinicalNames: ''
      });

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

  handleClick(drug) {
    debugger;
    this.relatedSearch(drug)
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

    // const drugGroup =  results ? results.map((drug, index) => {
    //   return (
    //     <li key={index}><a onClick={() => this.relatedSearch(drug)}>{drug.synonym}</a></li>
    //   )
    //  }) : null;

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
             onClick={this.handleClick}
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
