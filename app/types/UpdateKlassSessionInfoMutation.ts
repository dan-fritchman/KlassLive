/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateKlassSessionInfo, Visibility, KlassSessionState, SessionSetupState, PaymentState, GradingState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateKlassSessionInfoMutation
// ====================================================

export interface UpdateKlassSessionInfoMutation_updateKlassSessionInfo_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UpdateKlassSessionInfoMutation_updateKlassSessionInfo_user_sessions_user {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UpdateKlassSessionInfoMutation_updateKlassSessionInfo_user_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface UpdateKlassSessionInfoMutation_updateKlassSessionInfo_user_sessions_responses {
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

export interface UpdateKlassSessionInfoMutation_updateKlassSessionInfo_user_sessions {
  __typename: "UserSession";
  id: string;
  user: UpdateKlassSessionInfoMutation_updateKlassSessionInfo_user_sessions_user;
  scores: UpdateKlassSessionInfoMutation_updateKlassSessionInfo_user_sessions_scores;
  responses: (UpdateKlassSessionInfoMutation_updateKlassSessionInfo_user_sessions_responses | null)[];
}

export interface UpdateKlassSessionInfoMutation_updateKlassSessionInfo {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  host: UpdateKlassSessionInfoMutation_updateKlassSessionInfo_host;
  visibility: Visibility | null;
  session_state: KlassSessionState;
  setup_state: SessionSetupState | null;
  payment_state: PaymentState | null;
  problem_num: number;
  user_sessions: (UpdateKlassSessionInfoMutation_updateKlassSessionInfo_user_sessions | null)[];
}

export interface UpdateKlassSessionInfoMutation {
  updateKlassSessionInfo: UpdateKlassSessionInfoMutation_updateKlassSessionInfo | null;
}

export interface UpdateKlassSessionInfoMutationVariables {
  data?: UpdateKlassSessionInfo | null;
}
