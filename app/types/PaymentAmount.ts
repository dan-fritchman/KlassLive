/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PayForType } from "./globalTypes";

// ====================================================
// GraphQL query operation: PaymentAmount
// ====================================================

export interface PaymentAmount {
  payment_amount: number | null;
}

export interface PaymentAmountVariables {
  for_type?: PayForType | null;
  id?: string | null;
}
