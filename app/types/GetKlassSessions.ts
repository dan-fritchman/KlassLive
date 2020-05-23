/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Visibility, KlassSessionState } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetKlassSessions
// ====================================================

export interface GetKlassSessions_klass_sessions_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface GetKlassSessions_klass_sessions_user_sessions_user {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface GetKlassSessions_klass_sessions_user_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface GetKlassSessions_klass_sessions_user_sessions {
  __typename: "UserSession";
  id: string;
  user: GetKlassSessions_klass_sessions_user_sessions_user;
  scores: GetKlassSessions_klass_sessions_user_sessions_scores;
}

export interface GetKlassSessions_klass_sessions {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  host: GetKlassSessions_klass_sessions_host;
  visibility: Visibility | null;
  session_state: KlassSessionState;
  problem_num: number;
  user_sessions: (GetKlassSessions_klass_sessions_user_sessions | null)[];
}

export interface GetKlassSessions {
  klass_sessions: (GetKlassSessions_klass_sessions | null)[] | null;
}
