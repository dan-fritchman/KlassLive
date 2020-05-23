/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserKlassesFragment
// ====================================================

export interface UserKlassesFragment_klasses_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserKlassesFragment_klasses {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: UserKlassesFragment_klasses_owner;
}

export interface UserKlassesFragment {
  __typename: "User";
  klasses: (UserKlassesFragment_klasses | null)[] | null;
}
