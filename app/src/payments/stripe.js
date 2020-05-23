import React from "react";
import {Elements, CardElement, injectStripe, StripeProvider} from "react-stripe-elements";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";

import Api from "../KlassLive/api";
import * as AppUi from "../Store/AppUi";
import StripeSomething from "./StripeCardsSection";


const {REACT_APP_KLASSLIVE_STRIPE_PUBLIC_KEY} = process.env;

export const Provider = props => {
    return <StripeProvider apiKey={REACT_APP_KLASSLIVE_STRIPE_PUBLIC_KEY}>
        {props.children}
    </StripeProvider>;
};

const cardFormOptions = () => {
    return {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                fontFamily: 'Open Sans, sans-serif',
                letterSpacing: '0.025em',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#c23d4b',
            },
        }
    }
};

class _CardForm extends React.Component {
    state = {errorMessage: '', waiting: false, amount: null};
    componentDidMount = async () => {
        const {id, for_type} = this.props;
        const {data, error} = await Api.query({
            query: Api.PAYMENT_AMOUNT_QUERY,
            variables: {id, for_type}
        });
        if (error || !data || !data.payment_amount) {
            AppUi.openSnackbar(`Error Creating Session`);
            return;
        }
        const {payment_amount} = data;
        this.setState({amount: payment_amount})
    };
    handleChange = ({error}) => {
        if (error) {
            this.setState({errorMessage: error.message});
        }
    };
    onSubmit = async ev => {
        ev.preventDefault();  // We don't want to let default form submission happen here, which would refresh the page.
        this.setState({waiting: true});
        const {stripe} = this.props;
        if (!stripe) {
            AppUi.openSnackbar(`Error Connecting to Payment Server`);
            return this.setState({waiting: false});
        }
        const payload = await stripe.createToken();
        if (!payload || !payload.token || !payload.token.id) {
            AppUi.openSnackbar(`Error Submitting to Payment Server`);
            return this.setState({waiting: false});
        }
        const token = payload.token.id;

        const {id, for_type} = this.props;
        const {data, error} = await Api.mutate({
            mutation: Api.PAYMENT_TOKEN_MUTATION,
            variables: {id, for_type, token}
        });
        if (error || !data || !data.payment_token) {
            AppUi.openSnackbar(`Error Submitting: Payment Failed`);
            return;
        }
        AppUi.openSnackbar(`Payment Complete`);
        this.setState({waiting: false});
        if (this.props.onComplete) this.props.onComplete();
    };

    render() {
        return <form onSubmit={this.onSubmit}>
            <StripeSomething/>

            {this.state.errorMessage}
            {this.state.waiting ?
                <CircularProgress/> :
                <Button type={"submit"}>{`Pay $${this.state.amount / 100.0}`}</Button>
            }
        </form>;
    }
}

const CardForm = injectStripe(_CardForm);

export const PaymentForm = props => {
    return <Elements>
        <CardForm {...props}/>
    </Elements>
};

