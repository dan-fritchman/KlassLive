/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { KlassSessionState } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_user_sessions_klass_session_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface GetUser_user_sessions_klass_session {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  session_state: KlassSessionState;
  problem_num: number;
  host: GetUser_user_sessions_klass_session_host;
}

export interface GetUser_user_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface GetUser_user_sessions {
  __typename: "UserSession";
  id: string;
  klass_session: GetUser_user_sessions_klass_session;
  scores: GetUser_user_sessions_scores;
}

export interface GetUser_user {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  sessions: (GetUser_user_sessions | null)[] | null;
}

export interface GetUser {
  user: GetUser_user | null;
}

export interface GetUserVariables {
  id?: string | null;
}
