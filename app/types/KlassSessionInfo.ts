/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Visibility } from "./globalTypes";

// ====================================================
// GraphQL fragment: KlassSessionInfo
// ====================================================

export interface KlassSessionInfo_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface KlassSessionInfo {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  host: KlassSessionInfo_host;
  visibility: Visibility | null;
}
