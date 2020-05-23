/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { GradingState } from "./globalTypes";

// ====================================================
// GraphQL fragment: CellData
// ====================================================

export interface CellData_submission {
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

export interface CellData {
  __typename: "Cell";
  cell_type: string | null;
  execution_count: number | null;
  source: string | null;
  metadata: any | null;
  submission: CellData_submission | null;
}
