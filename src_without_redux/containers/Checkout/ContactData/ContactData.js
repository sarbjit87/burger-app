import React, {Component} from 'react';
import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';

class ContactData extends Component {
  state = {
    orderForm : {
      name : {
        elementType : 'input',
        elementConfig : {
          type : 'text',
          placeholder : 'Your Name'
        },
        value : '',
        validation : {
          required : true
        },
        valid : false,
        touched : false
      },
      street : {
        elementType : 'input',
        elementConfig : {
          type : 'text',
          placeholder : 'Street'
        },
        value : '',
        validation : {
          required : true
        },
        valid : false,
        touched : false
      },
      zipCode : {
        elementType : 'input',
        elementConfig : {
          type : 'text',
          placeholder : 'Zip Code'
        },
        value : '',
        validation : {
          required : true,
          minLength : 6
        },
        valid : false,
        touched : false
      },
      country : {
        elementType : 'input',
        elementConfig : {
          type : 'text',
          placeholder : 'Country'
        },
        value : '',
        validation : {
          required : true
        },
        valid : false,
        touched : false
      },
      email : {
        elementType : 'input',
        elementConfig : {
          type : 'email',
          placeholder : 'Email'
        },
        value : '',
        validation : {
          required : true
        },
        valid : false,
        touched : false
      },
      deliveryMethod : {
        elementType : 'select',
        elementConfig : {
          options : [{value : 'fastest', displayValue : 'Fastest'},
                     {value : 'cheapest', displayValue : 'Cheapest'}]
        },
        value : 'fastest',
        validation : {},
        valid : true
      },
    },
    formIsValid : false,
    loading : false
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading : true})
    const formData = {};
    for (let k in this.state.orderForm) {
      formData[k] = this.state.orderForm[k].value;
    }
    const order = {
      ingredients : this.props.ingredients,
      price : this.props.price,
      orderData : formData
    }

    axios.post('/orders.json', order)
    .then(response => {
      this.setState({loading : false})
      this.props.history.push('/')
    })
    .catch(error => {
      this.setState({loading : false})
    });
  }

  inputChangedHandler = (event,inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    }
    // Clone deeply
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    }
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation)
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let k in updatedOrderForm) {
      formIsValid = updatedOrderForm[k].valid && formIsValid;
    }

    this.setState({orderForm : updatedOrderForm, formIsValid : formIsValid})
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    return isValid;
  }

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id : key,
        config : this.state.orderForm[key]
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            key={formElement.id}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event,formElement.id)}
            value={formElement.config.value}/>
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>Order Now</Button>
      </form>
    )

    if(this.state.loading) {
      form = <Spinner />
    }

    return (
      <div className={classes.ContactData}>
        {form}
      </div>
    );
  }
}

export default ContactData;
