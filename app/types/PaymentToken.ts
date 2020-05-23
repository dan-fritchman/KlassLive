/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PayForType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: PaymentToken
// ====================================================

export interface PaymentToken {
  payment_token: boolean | null;
}

export interface PaymentTokenVariables {
  for_type?: PayForType | null;
  id?: string | null;
  token?: string | null;
}
