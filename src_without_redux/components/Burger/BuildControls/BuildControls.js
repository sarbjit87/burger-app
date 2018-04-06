import React from 'react';
import BuildControl from './BuildControl/BuildControl'
import classes from './BuildControls.css'

const controls = [
  { label : 'Salad', type: 'salad'},
  { label : 'Bacon', type: 'bacon'},
  { label : 'Cheese', type: 'cheese'},
  { label : 'Meat', type: 'meat'},
]

const buildControls = (props) => (
  <div className={classes.BuildControls}>
    <p>Current Price : <strong>{props.price.toFixed(2)}</strong></p>
    {controls.map((elem) => {
      return <BuildControl
              key={elem.label}
              label={elem.label}
              disabled={props.disabled[elem.type]}
              removed={() => props.ingredientRemoved(elem.type)}
              added={() => props.ingredientAdded(elem.type)}/> // Here we are using ES6 function to prevent passing of type
    })}
    <button className={classes.OrderButton} disabled={props.purchasable} onClick={props.ordered}>Order Now</button>
  </div>
);

export default buildControls;
