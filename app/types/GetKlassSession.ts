/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Visibility, KlassSessionState, SessionSetupState, PaymentState, GradingState } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetKlassSession
// ====================================================

export interface GetKlassSession_klass_session_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface GetKlassSession_klass_session_user_sessions_user {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface GetKlassSession_klass_session_user_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface GetKlassSession_klass_session_user_sessions_responses {
  __typename: "Submission";
  id: string;
  klass_id: string | null;
  user_session_id: string | null;
  klass_session_id: string | null;
  problem_num: number;
  state: GradingState;
  score: number | null;
  source: string | null;
  output: string | null;
  errs: string | null;
}

export interface GetKlassSession_klass_session_user_sessions {
  __typename: "UserSession";
  id: string;
  user: GetKlassSession_klass_session_user_sessions_user;
  scores: GetKlassSession_klass_session_user_sessions_scores;
  responses: (GetKlassSession_klass_session_user_sessions_responses | null)[];
}

export interface GetKlassSession_klass_session {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  host: GetKlassSession_klass_session_host;
  visibility: Visibility | null;
  session_state: KlassSessionState;
  setup_state: SessionSetupState | null;
  payment_state: PaymentState | null;
  problem_num: number;
  user_sessions: (GetKlassSession_klass_session_user_sessions | null)[];
}

export interface GetKlassSession {
  klass_session: GetKlassSession_klass_session | null;
}

export interface GetKlassSessionVariables {
  id?: string | null;
}
