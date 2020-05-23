/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Visibility, GradingState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: GetKlassFolded
// ====================================================

export interface GetKlassFolded_forkKlass_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface GetKlassFolded_forkKlass_problems_setup_submission {
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

export interface GetKlassFolded_forkKlass_problems_setup {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: GetKlassFolded_forkKlass_problems_setup_submission | null;
}

export interface GetKlassFolded_forkKlass_problems_prompt_submission {
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

export interface GetKlassFolded_forkKlass_problems_prompt {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: GetKlassFolded_forkKlass_problems_prompt_submission | null;
}

export interface GetKlassFolded_forkKlass_problems_solution_submission {
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

export interface GetKlassFolded_forkKlass_problems_solution {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: GetKlassFolded_forkKlass_problems_solution_submission | null;
}

export interface GetKlassFolded_forkKlass_problems_tests_submission {
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

export interface GetKlassFolded_forkKlass_problems_tests {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: GetKlassFolded_forkKlass_problems_tests_submission | null;
}

export interface GetKlassFolded_forkKlass_problems {
  __typename: "Problem";
  title: string | null;
  desc: string | null;
  setup: (GetKlassFolded_forkKlass_problems_setup | null)[];
  prompt: GetKlassFolded_forkKlass_problems_prompt;
  solution: GetKlassFolded_forkKlass_problems_solution;
  tests: GetKlassFolded_forkKlass_problems_tests;
}

export interface GetKlassFolded_forkKlass_scratch_submission {
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

export interface GetKlassFolded_forkKlass_scratch {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: GetKlassFolded_forkKlass_scratch_submission | null;
}

export interface GetKlassFolded_forkKlass {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: GetKlassFolded_forkKlass_owner;
  runtime: any | null;
  visibility: Visibility | null;
  problems: (GetKlassFolded_forkKlass_problems | null)[];
  scratch: (GetKlassFolded_forkKlass_scratch | null)[] | null;
}

export interface GetKlassFolded {
  forkKlass: GetKlassFolded_forkKlass | null;
}

export interface GetKlassFoldedVariables {
  klass_id?: string | null;
}
