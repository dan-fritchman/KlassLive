/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { GradingState } from "./globalTypes";

// ====================================================
// GraphQL fragment: KlassContentFragment
// ====================================================

export interface KlassContentFragment_problems_setup_submission {
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

export interface KlassContentFragment_problems_setup {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassContentFragment_problems_setup_submission | null;
}

export interface KlassContentFragment_problems_prompt_submission {
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

export interface KlassContentFragment_problems_prompt {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassContentFragment_problems_prompt_submission | null;
}

export interface KlassContentFragment_problems_solution_submission {
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

export interface KlassContentFragment_problems_solution {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassContentFragment_problems_solution_submission | null;
}

export interface KlassContentFragment_problems_tests_submission {
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

export interface KlassContentFragment_problems_tests {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassContentFragment_problems_tests_submission | null;
}

export interface KlassContentFragment_problems {
  __typename: "Problem";
  title: string | null;
  desc: string | null;
  setup: (KlassContentFragment_problems_setup | null)[];
  prompt: KlassContentFragment_problems_prompt;
  solution: KlassContentFragment_problems_solution;
  tests: KlassContentFragment_problems_tests;
}

export interface KlassContentFragment_scratch_submission {
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

export interface KlassContentFragment_scratch {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: KlassContentFragment_scratch_submission | null;
}

export interface KlassContentFragment {
  __typename: "KlassFolded";
  problems: (KlassContentFragment_problems | null)[];
  scratch: (KlassContentFragment_scratch | null)[] | null;
}
