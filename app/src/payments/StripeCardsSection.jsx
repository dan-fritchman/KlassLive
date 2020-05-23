import React, { PureComponent } from 'react'

import Grid from '@material-ui/core/Grid'
import { CardNumberElement, CardExpiryElement, CardCVCElement } from 'react-stripe-elements'

import StripeElementWrapper from './StripeElementWrapper'

export default class extends PureComponent {
    static displayName = 'StripeCardsSection';

    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <StripeElementWrapper label="Card Number" component={CardNumberElement} />
                </Grid>
                <Grid item xs={7}>
                    <StripeElementWrapper label="Expiry (MM / YY)" component={CardExpiryElement} />
                </Grid>
                <Grid item xs={5}>
                    <StripeElementWrapper label="CVC" component={CardCVCElement} />
                </Grid>
            </Grid>
        )
    }
}