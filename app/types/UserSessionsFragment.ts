/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { KlassSessionState } from "./globalTypes";

// ====================================================
// GraphQL fragment: UserSessionsFragment
// ====================================================

export interface UserSessionsFragment_sessions_klass_session_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserSessionsFragment_sessions_klass_session {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  session_state: KlassSessionState;
  problem_num: number;
  host: UserSessionsFragment_sessions_klass_session_host;
}

export interface UserSessionsFragment_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface UserSessionsFragment_sessions {
  __typename: "UserSession";
  id: string;
  klass_session: UserSessionsFragment_sessions_klass_session;
  scores: UserSessionsFragment_sessions_scores;
}

export interface UserSessionsFragment {
  __typename: "User";
  sessions: (UserSessionsFragment_sessions | null)[] | null;
}
