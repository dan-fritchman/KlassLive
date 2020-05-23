/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { KlassSessionState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: PermissionRequest
// ====================================================

export interface PermissionRequest_permission_request_klasses_owner {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface PermissionRequest_permission_request_klasses {
  __typename: "KlassFolded";
  id: string;
  title: string | null;
  desc: string | null;
  owner: PermissionRequest_permission_request_klasses_owner;
}

export interface PermissionRequest_permission_request_sessions_klass_session_host {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface PermissionRequest_permission_request_sessions_klass_session {
  __typename: "KlassSession";
  id: string;
  title: string | null;
  session_state: KlassSessionState;
  problem_num: number;
  host: PermissionRequest_permission_request_sessions_klass_session_host;
}

export interface PermissionRequest_permission_request_sessions_scores {
  __typename: "Scores";
  problems: (number | null)[];
  total: number | null;
}

export interface PermissionRequest_permission_request_sessions {
  __typename: "UserSession";
  id: string;
  klass_session: PermissionRequest_permission_request_sessions_klass_session;
  scores: PermissionRequest_permission_request_sessions_scores;
}

export interface PermissionRequest_permission_request {
  __typename: "User";
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  klasses: (PermissionRequest_permission_request_klasses | null)[] | null;
  sessions: (PermissionRequest_permission_request_sessions | null)[] | null;
  permissions: any | null;
}

export interface PermissionRequest {
  permission_request: PermissionRequest_permission_request | null;
}

export interface PermissionRequestVariables {
  permissionTypes?: (string | null)[] | null;
}
