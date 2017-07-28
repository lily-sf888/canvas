import React, { Component } from 'react';
//component for displaying list of results
const SearchResults = ({results, onSelectDrug}) => {
  const drugGroup = results.map((drug, index) => {
    return (
      <li key={index}><a onClick={() => onSelectDrug(drug)}>{drug.synonym}</a></li>
    )
  })
  return(
    <div>
      <h2>Search Results</h2>
      <ul>{drugGroup}</ul>
    </div>
  )
}

export default SearchResults;
