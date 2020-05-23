/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { KlassFoldedInput, GradingState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SubmitSolutionMutation
// ====================================================

export interface SubmitSolutionMutation_check_solution {
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

export interface SubmitSolutionMutation {
  check_solution: SubmitSolutionMutation_check_solution | null;
}

export interface SubmitSolutionMutationVariables {
  klass?: KlassFoldedInput | null;
  problem_num?: number | null;
}
