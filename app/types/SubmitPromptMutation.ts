/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { KlassFoldedInput, GradingState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SubmitPromptMutation
// ====================================================

export interface SubmitPromptMutation_check_prompt {
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

export interface SubmitPromptMutation {
  check_prompt: SubmitPromptMutation_check_prompt | null;
}

export interface SubmitPromptMutationVariables {
  klass?: KlassFoldedInput | null;
  problem_num?: number | null;
}
