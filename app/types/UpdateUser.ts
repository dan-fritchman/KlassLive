/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateUser, KlassSessionState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser_klasses_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UpdateUser_updateUser_klasses {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: UpdateUser_updateUser_klasses_owner;
}

export interface UpdateUser_updateUser_sessions_klass_session_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UpdateUser_updateUser_sessions_klass_session {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  session_state: KlassSessionState;
  problem_num: number;
  host: UpdateUser_updateUser_sessions_klass_session_host;
}

export interface UpdateUser_updateUser_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface UpdateUser_updateUser_sessions {
  __typename: "UserSession";
  id: string;
  klass_session: UpdateUser_updateUser_sessions_klass_session;
  scores: UpdateUser_updateUser_sessions_scores;
}

export interface UpdateUser_updateUser {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  klasses: (UpdateUser_updateUser_klasses | null)[] | null;
  sessions: (UpdateUser_updateUser_sessions | null)[] | null;
  permissions: any | null;
}

export interface UpdateUser {
  updateUser: UpdateUser_updateUser | null;
}

export interface UpdateUserVariables {
  data?: UpdateUser | null;
}
