/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Visibility } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetKlasses
// ====================================================

export interface GetKlasses_klasses_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface GetKlasses_klasses {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: GetKlasses_klasses_owner;
  runtime: any | null;
  visibility: Visibility | null;
}

export interface GetKlasses {
  klasses: (GetKlasses_klasses | null)[] | null;
}
