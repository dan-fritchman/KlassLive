/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { KlassSessionState } from "./globalTypes";

// ====================================================
// GraphQL fragment: UserDetailFragment
// ====================================================

export interface UserDetailFragment_klasses_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserDetailFragment_klasses {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: UserDetailFragment_klasses_owner;
}

export interface UserDetailFragment_sessions_klass_session_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserDetailFragment_sessions_klass_session {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  session_state: KlassSessionState;
  problem_num: number;
  host: UserDetailFragment_sessions_klass_session_host;
}

export interface UserDetailFragment_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface UserDetailFragment_sessions {
  __typename: "UserSession";
  id: string;
  klass_session: UserDetailFragment_sessions_klass_session;
  scores: UserDetailFragment_sessions_scores;
}

export interface UserDetailFragment {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  klasses: (UserDetailFragment_klasses | null)[] | null;
  sessions: (UserDetailFragment_sessions | null)[] | null;
  permissions: any | null;
}
