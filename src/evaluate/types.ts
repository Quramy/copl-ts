import { IdentifierNode, FunctionDefinitionNode } from "../parser";

export interface EvaluationFailure {
  readonly message: string;
}

export interface Environment {
  get(identifier: IdentifierNode): EvaluationValue | undefined;
  print(): readonly string[];
}

export interface Closure {
  readonly kind: "Closure";
  readonly functionDefinition: FunctionDefinitionNode;
  readonly env: Environment;
  readonly closureModifier?: string;
}

export interface RecClosure extends Closure {
  readonly closureModifier: "Recursive";
  readonly recursievId: IdentifierNode;
}

export type EvaluationList = readonly EvaluationValue[];
export type EvaluationValue = number | boolean | Closure | EvaluationList;

export type EvaluationResult =
  | {
      ok: true;
      value: EvaluationValue;
    }
  | {
      ok: false;
      value: EvaluationFailure;
    };