import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  ingredients : null,
  totalPrice : 4,
  error : false,
  building : false
};

const INGREDIENT_PRICES = {
  cheese : 0.4,
  bacon  : 1.2,
  meat   : 1.5,
  salad  : 0.8
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.ADD_INGREDIENT:
      const updatedIngredient = { [action.ingredientName] : state.ingredients[action.ingredientName] + 1 }
      const updatedIngredients = updateObject(state.ingredients, updatedIngredient );
      const updatedState = {
        ingredients : updatedIngredients,
        totalPrice : state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building : true
      }
      // Deep clone the object since we have to return a new Object
      // use the syntax [] = state..+1 to overwrite existing element of object (ES6 feature)
      return updateObject(state,updatedState)
    case actionTypes.REMOVE_INGREDIENT:
      const updatedIngredient1 = { [action.ingredientName] : state.ingredients[action.ingredientName] - 1 }
      const updatedIngredients1 = updateObject(state.ingredients, updatedIngredient1 );
      const updatedState1 = {
        ingredients : updatedIngredients1,
        building : true,
        totalPrice : state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
      }
      return updateObject(state,updatedState1)
    case actionTypes.SET_INGREDIENTS:
      return updateObject(state, {
        ingredients : {
          salad : action.ingredients.salad,
          bacon : action.ingredients.bacon,
          cheese : action.ingredients.cheese,
          meat : action.ingredients.meat
        },
        totalPrice : 4,
        error : false,
        building : false
      })
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return updateObject(state,{error : true})
    default :
      return state;
  }
};

export default reducer;
