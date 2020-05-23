/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SessionSetupState, GradingState } from "./globalTypes";

// ====================================================
// GraphQL query operation: KlassSetupCheck
// ====================================================

export interface KlassSetupCheck_klass_setup_check_prompts {
  __typename: "ProblemCheck";
  klass_id: string;
  problem_num: number;
  state: GradingState;
  score: number | null;
  source: string | null;
  output: string | null;
  errs: string | null;
}

export interface KlassSetupCheck_klass_setup_check_solutions {
  __typename: "ProblemCheck";
  klass_id: string;
  problem_num: number;
  state: GradingState;
  score: number | null;
  source: string | null;
  output: string | null;
  errs: string | null;
}

export interface KlassSetupCheck_klass_setup_check {
  __typename: "KlassSetupCheck";
  id: string;
  state: SessionSetupState | null;
  build: SessionSetupState | null;
  prompts: (KlassSetupCheck_klass_setup_check_prompts | null)[] | null;
  solutions: (KlassSetupCheck_klass_setup_check_solutions | null)[] | null;
}

export interface KlassSetupCheck {
  klass_setup_check: KlassSetupCheck_klass_setup_check | null;
}

export interface KlassSetupCheckVariables {
  id?: string | null;
}
