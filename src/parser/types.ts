export interface Position {
  readonly loc?: {
    readonly pos: number;
    readonly end: number;
  };
}

export type Symbols = readonly ["(", ")", "+", "-", "*", "<", "=", "->", "[", "]", "::", "|"];
export type SymbolKind = Symbols[number];
export type ReservedWords = readonly [
  "if",
  "then",
  "else",
  "let",
  "in",
  "fun",
  "rec",
  "true",
  "false",
  "match",
  "with",
];
export type ReservedWordKind = ReservedWords[number];

export interface TokenBase<T extends string> extends Position {
  readonly tokenKind: T;
}

export interface SymbolToken extends TokenBase<"Symbol"> {
  readonly symbol: SymbolKind;
}

export interface KeywordToken extends TokenBase<"Keyword"> {
  readonly keyword: ReservedWordKind;
}
export interface VariableToken extends TokenBase<"Variable"> {
  name: string;
}

export interface NumberToken extends TokenBase<"Number"> {
  readonly value: number;
}

export type Token = SymbolToken | KeywordToken | NumberToken | VariableToken;

export interface AddOperation {
  readonly kind: "Add";
  readonly token: Token;
}

export interface SubOperation {
  readonly kind: "Sub";
  readonly token: Token;
}

export interface MultiplyOperation {
  readonly kind: "Multiply";
  readonly token: Token;
}

export interface LessThanOperation {
  readonly kind: "LessThan";
  readonly token: Token;
}

export interface ConsOperation {
  readonly kind: "Cons";
  readonly token: Token;
}

export type BinaryOperation = AddOperation | SubOperation | MultiplyOperation | LessThanOperation | ConsOperation;

export interface Node<T extends string> extends Position {
  readonly kind: T;
}

export interface NumberLiteralNode extends Node<"NumberLiteral"> {
  readonly value: number;
}

export interface BoolLiteralNode extends Node<"BoolLiteral"> {
  readonly value: boolean;
}

export interface IdentifierNode extends Node<"Identifier"> {
  readonly name: string;
}

export interface BinaryExpressionNode extends Node<"BinaryExpression"> {
  readonly op: BinaryOperation;
  readonly left: ExpressionNode;
  readonly right: ExpressionNode;
}

export interface IfExpressionNode extends Node<"IfExpression"> {
  readonly cond: ExpressionNode;
  readonly then: ExpressionNode;
  readonly else: ExpressionNode;
}

export interface LetExpressionNode extends Node<"LetExpression"> {
  readonly identifier: IdentifierNode;
  readonly binding: ExpressionNode;
  readonly exp: ExpressionNode;
}

export interface FunctionDefinitionNode extends Node<"FunctionDefinition"> {
  readonly param: IdentifierNode;
  readonly body: ExpressionNode;
}

export interface LetRecExpressionNode extends Node<"LetRecExpression"> {
  readonly identifier: IdentifierNode;
  readonly binding: FunctionDefinitionNode;
  readonly exp: ExpressionNode;
}

export interface FunctionApplicationNode extends Node<"FunctionApplication"> {
  readonly callee: ExpressionNode;
  readonly argument: ExpressionNode;
}

export interface EmptyListNode extends Node<"EmptyList"> {}

export interface MatchExpressionNode extends Node<"MatchExpression"> {
  readonly exp: ExpressionNode;
  readonly emptyClause: ExpressionNode;
  readonly leftIdentifier: IdentifierNode;
  readonly rightIdentifier: IdentifierNode;
  readonly consClause: ExpressionNode;
}

export type ExpressionNode =
  | NumberLiteralNode
  | BoolLiteralNode
  | EmptyListNode
  | IdentifierNode
  | BinaryExpressionNode
  | IfExpressionNode
  | LetExpressionNode
  | FunctionDefinitionNode
  | LetRecExpressionNode
  | FunctionApplicationNode
  | MatchExpressionNode;
