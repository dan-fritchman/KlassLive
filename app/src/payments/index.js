const React = require('react');

if (true) { //process.env.USE_STRIPE) { // FIXME
    const stripe = require('./stripe');
    module.exports.Provider = stripe.Provider;
    module.exports.PaymentForm = stripe.PaymentForm;
} else {
    /* If not using stripe, export dummy pass-through Components. */
    module.exports.Provider = props => {
        return <React.Fragment>
            {props.children}
        </React.Fragment>;
    };
    module.exports.PaymentForm = props => {
        return <React.Fragment>
            "Dummy PaymentForm"
        </React.Fragment>;
    };
}
