/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProblemSubmission, GradingState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SubmitProblemMutation
// ====================================================

export interface SubmitProblemMutation_submission {
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

export interface SubmitProblemMutation {
  submission: SubmitProblemMutation_submission | null;
}

export interface SubmitProblemMutationVariables {
  data?: ProblemSubmission | null;
}
