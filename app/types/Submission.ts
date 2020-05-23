/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { GradingState } from "./globalTypes";

// ====================================================
// GraphQL query operation: Submission
// ====================================================

export interface Submission_submission {
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

export interface Submission {
  submission: Submission_submission | null;
}

export interface SubmissionVariables {
  id?: string | null;
}
