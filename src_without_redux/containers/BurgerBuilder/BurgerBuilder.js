import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENT_PRICES = {
  cheese : 0.4,
  bacon  : 1.2,
  meat   : 1.5,
  salad  : 0.8
}

class BurgerBuilder extends Component {
  state = {
    ingredients : null,
    totalPrice : 4,   // Base price of a burger
    purchasable : false,
    purchasing : false,
    loading : false,
    error : false
  }

  componentDidMount() {
    axios.get('https://react-my-burger-a0473.firebaseio.com/ingredients.json')
    .then( response => {
      this.setState({ingredients: response.data})
    })
    .catch( error => {
      this.setState({error : true})
    })
  }

  /* The arrow function syntax ensures that the this keyword keeps its context and refers to the class.
     It would NOT do that otherwise if the method gets called via an event.
     For updatePurchaseState(), we don't face that issue because it's not assigned to an event but called from within the class. */
  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients).map( (ingKey) => {
      return ingredients[ingKey]
    }).reduce((total,elem) => {
      return total + elem
    });
    this.setState({purchasable : sum > 0})
  }

  addIngredientHandler = (type) => {
    const existingIngredients = {...this.state.ingredients}; // Update the state in an immutable way
    const existingIngredientCount = existingIngredients[type];
    let updatedIngredientCount = existingIngredientCount + 1;
    existingIngredients[type] = updatedIngredientCount;
    let existingTotalPrice = this.state.totalPrice;
    existingTotalPrice = existingTotalPrice + INGREDIENT_PRICES[type];
    this.setState(
      {ingredients : existingIngredients, totalPrice : existingTotalPrice}
    )
    this.updatePurchaseState(existingIngredients);
  }

  removeIngredientHandler = (type) => {
    const existingIngredients = {...this.state.ingredients}; // Update the state in an immutable way
    const existingIngredientCount = existingIngredients[type];
    if (existingIngredientCount <= 0) {
      return;
    }
    let updatedIngredientCount = existingIngredientCount - 1;
    existingIngredients[type] = updatedIngredientCount;
    let existingTotalPrice = this.state.totalPrice;
    existingTotalPrice = existingTotalPrice - INGREDIENT_PRICES[type];
    this.setState(
      {ingredients : existingIngredients, totalPrice : existingTotalPrice}
    )
    this.updatePurchaseState(existingIngredients);
  }

  updatePurchase = () => {
    this.setState({purchasing : true})
  }

  cancelPurchase = () => {
    this.setState({purchasing : false})
  }

  purchaseContinueHandler = () => {
    //alert('You Continue')
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i]))
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = queryParams.join('&')
    this.props.history.push({
      pathname : '/checkout',
      search : '?' + queryString
    })
  }

  render() {
    const disabledInfo = {...this.state.ingredients};
    for( let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = this.state.error ? <p>Ingredients can't be loaed</p> : <Spinner />
    let orderSummary = null;

    if (this.state.ingredients) {
      burger = (
       <Aux>
         <Burger ingredients={this.state.ingredients} />
         <BuildControls
           disabled={disabledInfo}
           ordered={this.updatePurchase}
           purchasable={!this.state.purchasable}
           price={this.state.totalPrice}
           ingredientAdded={this.addIngredientHandler}
           ingredientRemoved={this.removeIngredientHandler} />
       </Aux>
     );
        orderSummary =  <OrderSummary
                 price={this.state.totalPrice}
                 purchaseCancelled={this.cancelPurchase}
                 purchaseContinued={this.purchaseContinueHandler}
                 ingredients={this.state.ingredients}/>
     }

     if (this.state.loading) {
         orderSummary = <Spinner />
     }

    return(
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.cancelPurchase}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder,axios)
