/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Visibility, GradingState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateKlassMutation
// ====================================================

export interface CreateKlassMutation_createKlass_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface CreateKlassMutation_createKlass_problems_setup_submission {
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

export interface CreateKlassMutation_createKlass_problems_setup {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: CreateKlassMutation_createKlass_problems_setup_submission | null;
}

export interface CreateKlassMutation_createKlass_problems_prompt_submission {
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

export interface CreateKlassMutation_createKlass_problems_prompt {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: CreateKlassMutation_createKlass_problems_prompt_submission | null;
}

export interface CreateKlassMutation_createKlass_problems_solution_submission {
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

export interface CreateKlassMutation_createKlass_problems_solution {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: CreateKlassMutation_createKlass_problems_solution_submission | null;
}

export interface CreateKlassMutation_createKlass_problems_tests_submission {
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

export interface CreateKlassMutation_createKlass_problems_tests {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: CreateKlassMutation_createKlass_problems_tests_submission | null;
}

export interface CreateKlassMutation_createKlass_problems {
  __typename: "Problem";
  title: string | null;
  desc: string | null;
  setup: (CreateKlassMutation_createKlass_problems_setup | null)[];
  prompt: CreateKlassMutation_createKlass_problems_prompt;
  solution: CreateKlassMutation_createKlass_problems_solution;
  tests: CreateKlassMutation_createKlass_problems_tests;
}

export interface CreateKlassMutation_createKlass_scratch_submission {
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

export interface CreateKlassMutation_createKlass_scratch {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: CreateKlassMutation_createKlass_scratch_submission | null;
}

export interface CreateKlassMutation_createKlass {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: CreateKlassMutation_createKlass_owner;
  runtime: any | null;
  visibility: Visibility | null;
  problems: (CreateKlassMutation_createKlass_problems | null)[];
  scratch: (CreateKlassMutation_createKlass_scratch | null)[] | null;
}

export interface CreateKlassMutation {
  createKlass: CreateKlassMutation_createKlass | null;
}
