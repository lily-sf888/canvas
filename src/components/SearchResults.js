import React, { Component } from 'react';

export default class SearchResults extends Component {

  render () {

    const drugGroup = this.props.results.map((drug, index) => {
      return (
        <li key={index}><a onClick={this.props.onClick}>{drug.synonym}</a></li>
      )
     })

    return(
      <div>
        <h2>Search Results</h2>
        <ul>{drugGroup}</ul>
      </div>
    )
  }
}
