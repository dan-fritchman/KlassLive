/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetKlass
// ====================================================

export interface GetKlass_klass {
  __typename: "KlassNotebook";
  nbformat: number | null;
  nbformat_minor: number | null;
  cells: (any | null)[] | null;
  metadata: any | null;
}

export interface GetKlass {
  klass: GetKlass_klass | null;
}

export interface GetKlassVariables {
  id?: string | null;
}
