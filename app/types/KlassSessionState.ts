/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { KlassSessionState } from "./globalTypes";

// ====================================================
// GraphQL fragment: KlassSessionState
// ====================================================

export interface KlassSessionState_user_sessions_user {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface KlassSessionState_user_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface KlassSessionState_user_sessions {
  __typename: "UserSession";
  id: string;
  user: KlassSessionState_user_sessions_user;
  scores: KlassSessionState_user_sessions_scores;
}

export interface KlassSessionState {
  __typename: "KlassSession";
  session_state: KlassSessionState;
  problem_num: number;
  user_sessions: (KlassSessionState_user_sessions | null)[];
}
