/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Visibility, GradingState } from "./globalTypes";

// ====================================================
// GraphQL fragment: KlassDataFragment
// ====================================================

export interface KlassDataFragment_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface KlassDataFragment_problems_setup_submission {
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

export interface KlassDataFragment_problems_setup {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassDataFragment_problems_setup_submission | null;
}

export interface KlassDataFragment_problems_prompt_submission {
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

export interface KlassDataFragment_problems_prompt {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassDataFragment_problems_prompt_submission | null;
}

export interface KlassDataFragment_problems_solution_submission {
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

export interface KlassDataFragment_problems_solution {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassDataFragment_problems_solution_submission | null;
}

export interface KlassDataFragment_problems_tests_submission {
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

export interface KlassDataFragment_problems_tests {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassDataFragment_problems_tests_submission | null;
}

export interface KlassDataFragment_problems {
  __typename: "Problem";
  title: string | null;
  desc: string | null;
  setup: (KlassDataFragment_problems_setup | null)[];
  prompt: KlassDataFragment_problems_prompt;
  solution: KlassDataFragment_problems_solution;
  tests: KlassDataFragment_problems_tests;
}

export interface KlassDataFragment_scratch_submission {
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

export interface KlassDataFragment_scratch {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassDataFragment_scratch_submission | null;
}

export interface KlassDataFragment {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: KlassDataFragment_owner;
  runtime: any | null;
  visibility: Visibility | null;
  problems: (KlassDataFragment_problems | null)[];
  scratch: (KlassDataFragment_scratch | null)[] | null;
}
