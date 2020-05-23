/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { GradingState, Visibility, KlassSessionState } from "./globalTypes";

// ====================================================
// GraphQL fragment: UserSessionFragment
// ====================================================

export interface UserSessionFragment_user {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserSessionFragment_responses {
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

export interface UserSessionFragment_klass_session_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserSessionFragment_klass_session_user_sessions_user {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserSessionFragment_klass_session_user_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface UserSessionFragment_klass_session_user_sessions {
  __typename: "UserSession";
  id: string;
  user: UserSessionFragment_klass_session_user_sessions_user;
  scores: UserSessionFragment_klass_session_user_sessions_scores;
}

export interface UserSessionFragment_klass_session_klass_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserSessionFragment_klass_session_klass_problems_setup_submission {
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

export interface UserSessionFragment_klass_session_klass_problems_setup {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: UserSessionFragment_klass_session_klass_problems_setup_submission | null;
}

export interface UserSessionFragment_klass_session_klass_problems_prompt_submission {
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

export interface UserSessionFragment_klass_session_klass_problems_prompt {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: UserSessionFragment_klass_session_klass_problems_prompt_submission | null;
}

export interface UserSessionFragment_klass_session_klass_problems_solution_submission {
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

export interface UserSessionFragment_klass_session_klass_problems_solution {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: UserSessionFragment_klass_session_klass_problems_solution_submission | null;
}

export interface UserSessionFragment_klass_session_klass_problems_tests_submission {
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

export interface UserSessionFragment_klass_session_klass_problems_tests {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: UserSessionFragment_klass_session_klass_problems_tests_submission | null;
}

export interface UserSessionFragment_klass_session_klass_problems {
  __typename: "Problem";
  title: string | null;
  desc: string | null;
  setup: (UserSessionFragment_klass_session_klass_problems_setup | null)[];
  prompt: UserSessionFragment_klass_session_klass_problems_prompt;
  solution: UserSessionFragment_klass_session_klass_problems_solution;
  tests: UserSessionFragment_klass_session_klass_problems_tests;
}

export interface UserSessionFragment_klass_session_klass_scratch_submission {
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

export interface UserSessionFragment_klass_session_klass_scratch {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: UserSessionFragment_klass_session_klass_scratch_submission | null;
}

export interface UserSessionFragment_klass_session_klass {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: UserSessionFragment_klass_session_klass_owner;
  runtime: any | null;
  visibility: Visibility | null;
  problems: (UserSessionFragment_klass_session_klass_problems | null)[];
  scratch: (UserSessionFragment_klass_session_klass_scratch | null)[] | null;
}

export interface UserSessionFragment_klass_session {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  host: UserSessionFragment_klass_session_host;
  visibility: Visibility | null;
  session_state: KlassSessionState;
  problem_num: number;
  user_sessions: (UserSessionFragment_klass_session_user_sessions | null)[];
  klass: UserSessionFragment_klass_session_klass;
}

export interface UserSessionFragment {
  __typename: "UserSession";
  id: string;
  state: string | null;
  user: UserSessionFragment_user;
  responses: (UserSessionFragment_responses | null)[];
  klass_session: UserSessionFragment_klass_session;
}
