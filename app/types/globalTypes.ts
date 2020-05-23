/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum GradingState {
  COMPLETE = "COMPLETE",
  IN_PROGRESS = "IN_PROGRESS",
}

export enum KlassSessionState {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  EXPIRED = "EXPIRED",
  FUTURE = "FUTURE",
}

export enum PayForType {
  KLASS = "KLASS",
  SESSION = "SESSION",
}

export enum PaymentState {
  FREE = "FREE",
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export enum SessionSetupState {
  FAILING = "FAILING",
  NOT_RUN = "NOT_RUN",
  PASSING = "PASSING",
  RUNNING = "RUNNING",
}

export enum Visibility {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export interface CreateKlassSession {
  title?: string | null;
  host_id: string;
  klass_id: string;
  times?: TimeInputs | null;
  visibility?: Visibility | null;
}

export interface JoinKlassSession {
  user_id?: string | null;
  klass_session_id: string;
}

export interface KlassFoldedInput {
  id: string;
  title?: string | null;
  desc?: string | null;
  problems: (any | null)[];
  scratch?: (any | null)[] | null;
  metadata?: any | null;
  notebookMeta?: any | null;
  runtime?: any | null;
  visibility?: Visibility | null;
}

export interface KlassNotebookInput {
  nbformat?: number | null;
  nbformat_minor?: number | null;
  metadata?: any | null;
  cells?: (any | null)[] | null;
}

export interface ProblemSubmission {
  user_session_id: string;
  klass_session_id: string;
  problem_num: number;
  klass?: KlassFoldedInput | null;
  source: string;
}

export interface TimeInputs {
  start?: string | null;
  finish?: string | null;
  duration?: number | null;
}

export interface UpdateKlassSessionInfo {
  id: string;
  title?: string | null;
  times?: TimeInputs | null;
  visibility?: Visibility | null;
}

export interface UpdateUser {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
