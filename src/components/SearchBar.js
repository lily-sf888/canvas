import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import "es6-promise/auto";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      results: null
    }
    this.handleChange = this.handleChange.bind(this);
    //this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});

  }

  // handleKeyPress(e) {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //
  //
  //     var url = 'https://rxnav.nlm.nih.gov/REST/drugs.json?name=alavert'
  //
  //       fetch(url)
  //       .then(function(response) {
  //         if (response.status >= 400) {
  //           throw new Error("Bad response from server");
  //         }
  //         return response.json();
  //       })
  //       .then(function(data) {
  //         console.log('new data', data.drugGroup.conceptGroup[1].conceptProperties);
  //         this.setState({results: data})
  //       })
  //     }
  //
  //   }
  //



  componentDidMount() {

    var url = 'https://rxnav.nlm.nih.gov/REST/drugs.json?name=alavert'
    var that = this;
    fetch(url)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
      console.log('new data', data.drugGroup.conceptGroup[1].conceptProperties[2].name);
      that.setState({results: data})
    })
  }

  render() {
    return (
      <form>
       <input
         type="text"
         placeholder="Search..."
         value={this.state.value}
         onChange={this.handleChange}
         onKeyPress={this.handleKeyPress}
       />
     </form>
    )
  }
}
