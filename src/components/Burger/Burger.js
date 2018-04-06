import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'
import classes from './Burger.css'

const burger = (props) => {
  console.log(props.ingredients)
  let transformedIngredients = Object.keys(props.ingredients).map(ingKey => {
      //return [...Array(parseFloat(props.ingredients[ingKey]).toFixed())].map((_,i) => {
      // Bug in Chrome - used this trick (refer lecture 208)
        return [...Array(props.ingredients[ingKey])].map((_,i) => {
        return <BurgerIngredient key={ingKey+i} type={ingKey} />;
      })
    }
  ).reduce((arr,el) => {
    return arr.concat(el)
  },[]);

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients</p>
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
}

export default burger;
