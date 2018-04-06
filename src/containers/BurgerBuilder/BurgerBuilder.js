import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
  cheese : 0.4,
  bacon  : 1.2,
  meat   : 1.5,
  salad  : 0.8
}

class BurgerBuilder extends Component {
  state = {
    purchasing : false,
    loading : false,
    error : false
  }

  componentDidMount() {
    console.log(this.props)
    this.props.onInitIngredients()
    /*
    */
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
    return sum > 0;
  }

  updatePurchase = () => {
    if (this.props.isAuthenticated) {
      this.setState({purchasing : true})
    } else {
      this.props.onSetAuthRedirectPath('/checkout')
      this.props.history.push('/auth')
    }
  }

  cancelPurchase = () => {
    this.setState({purchasing : false})
  }

  purchaseContinueHandler = () => {
    this.props.onInitPurchase()
    this.props.history.push('/checkout')
  }

  render() {
    const disabledInfo = {...this.props.ings}; // replace this.state.ingredients with this.props.ings for using redux state
    for( let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = this.props.error ? <p>Ingredients can't be loaed</p> : <Spinner />
    let orderSummary = null;

    if (this.props.ings) {
      burger = (
       <Aux>
         <Burger ingredients={this.props.ings} />
         <BuildControls
           isAuth={this.props.isAuthenticated}
           disabled={disabledInfo}
           ordered={this.updatePurchase}
           purchasable={!this.updatePurchaseState(this.props.ings)}
           price={this.props.price}
           ingredientAdded={this.props.onIngredientAdded}
           ingredientRemoved={this.props.onIngredientRemoved} />
       </Aux>
     );
        orderSummary =  <OrderSummary
                 price={this.props.price}
                 purchaseCancelled={this.cancelPurchase}
                 purchaseContinued={this.purchaseContinueHandler}
                 ingredients={this.props.ings}/>
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

const mapStateToProps = state => {
  return {
    ings : state.burgerBuilder.ingredients,
    price : state.burgerBuilder.totalPrice,
    error : state.burgerBuilder.error,
    isAuthenticated : state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded   : (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
    onIngredientRemoved : (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
    onInitIngredients : () => dispatch(burgerBuilderActions.initIngredients()),
    onInitPurchase : () => dispatch(burgerBuilderActions.purchaseInit()),
    onSetAuthRedirectPath : (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios))
