import React, { Component } from 'react';
//component for displaying related medication results
export default class RelatedResults extends Component {
  render() {
    const listIngredients = this.props.ingredients.map((item, index) =>
      <div key={index}>{item.name}</div>
    )
    const listBrandNames = this.props.brandNames.map((item, index) =>
      <div key={index}>{item.name}</div>
    )
    const listClinicalNames = this.props.clinicalNames.map((item, index) =>
      <div key={index}>{item.name}</div>
    )
    return (
      <div>
        <h2>Related Medication Results</h2>
        <div><h3>Ingredients</h3>{listIngredients}</div>
        <div><h3>Brand Name</h3>{listBrandNames}</div>
        <div><h3>Clinical Name</h3>{listClinicalNames}</div>
      </div>
    )
  }
}
