/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { KlassSessionState } from "./globalTypes";

// ====================================================
// GraphQL query operation: UserDetail
// ====================================================

export interface UserDetail_user_klasses_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserDetail_user_klasses {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: UserDetail_user_klasses_owner;
}

export interface UserDetail_user_sessions_klass_session_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserDetail_user_sessions_klass_session {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  session_state: KlassSessionState;
  problem_num: number;
  host: UserDetail_user_sessions_klass_session_host;
}

export interface UserDetail_user_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface UserDetail_user_sessions {
  __typename: "UserSession";
  id: string;
  klass_session: UserDetail_user_sessions_klass_session;
  scores: UserDetail_user_sessions_scores;
}

export interface UserDetail_user {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  klasses: (UserDetail_user_klasses | null)[] | null;
  sessions: (UserDetail_user_sessions | null)[] | null;
  permissions: any | null;
}

export interface UserDetail {
  user: UserDetail_user | null;
}

export interface UserDetailVariables {
  id?: string | null;
}
