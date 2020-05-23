/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Visibility } from "./globalTypes";

// ====================================================
// GraphQL fragment: KlassInfoFragment
// ====================================================

export interface KlassInfoFragment_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface KlassInfoFragment {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: KlassInfoFragment_owner;
  runtime: any | null;
  visibility: Visibility | null;
}
