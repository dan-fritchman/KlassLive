/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Visibility, KlassSessionState, SessionSetupState, PaymentState, GradingState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateProblemNumberMutation
// ====================================================

export interface UpdateProblemNumberMutation_updateProblemNumber_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UpdateProblemNumberMutation_updateProblemNumber_user_sessions_user {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UpdateProblemNumberMutation_updateProblemNumber_user_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface UpdateProblemNumberMutation_updateProblemNumber_user_sessions_responses {
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

export interface UpdateProblemNumberMutation_updateProblemNumber_user_sessions {
  __typename: "UserSession";
  id: string;
  user: UpdateProblemNumberMutation_updateProblemNumber_user_sessions_user;
  scores: UpdateProblemNumberMutation_updateProblemNumber_user_sessions_scores;
  responses: (UpdateProblemNumberMutation_updateProblemNumber_user_sessions_responses | null)[];
}

export interface UpdateProblemNumberMutation_updateProblemNumber {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  host: UpdateProblemNumberMutation_updateProblemNumber_host;
  visibility: Visibility | null;
  session_state: KlassSessionState;
  setup_state: SessionSetupState | null;
  payment_state: PaymentState | null;
  problem_num: number;
  user_sessions: (UpdateProblemNumberMutation_updateProblemNumber_user_sessions | null)[];
}

export interface UpdateProblemNumberMutation {
  updateProblemNumber: UpdateProblemNumberMutation_updateProblemNumber | null;
}

export interface UpdateProblemNumberMutationVariables {
  id?: string | null;
  num?: number | null;
}
