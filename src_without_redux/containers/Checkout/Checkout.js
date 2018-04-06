import React, {Component} from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  state = {
    ingredients : null,
    totalPrice : 0
  }

  extractParams(q) {
    let obj = {};
    let arr = q.substring(1).split('&');
    arr.forEach((param)=>{
        obj[param.split('=')[0]] = parseInt(param.split('=')[1], 10);
    });
    return obj;
  }

  componentWillMount() {
    const params = this.extractParams(this.props.location.search);
    const ingredients = {}
    let price = 0;
    for (let i in params) {
      if (i === 'price') {
        price = params[i].toFixed(2)
      } else {
        ingredients[i] = params[i]
      }
    }
    console.log("Debug")
    console.log(ingredients)
    this.setState({ingredients : ingredients, totalPrice : price})
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render () {
    return(
      <div>
        <CheckoutSummary
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
          ingredients={this.state.ingredients}/>
        <Route path={this.props.match.path + '/contact-data'}
          render={ (props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props}/>)} />
      </div>
    );
  }
}

export default Checkout
