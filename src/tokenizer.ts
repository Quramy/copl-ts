export interface NumberToken {
  readonly tokenKind: "Number";
  readonly value: number;
}

export interface BoolToken {
  readonly tokenKind: "Boolean";
  readonly value: boolean;
}

export interface LeftParenthesisToken {
  readonly tokenKind: "LeftParenthesis";
}

export interface RightParenthesisToken {
  readonly tokenKind: "RightParenthesis";
}

export interface PlusToken {
  readonly tokenKind: "Plus";
}

export interface MinusToken {
  readonly tokenKind: "Minus";
}

export interface TimesToken {
  readonly tokenKind: "Times";
}

export interface LessThanToken {
  readonly tokenKind: "LessThan";
}

export interface EqualToken {
  readonly tokenKind: "Equal";
}

export interface RightArrowToken {
  readonly tokenKind: "RightArrow";
}

export interface IfToken {
  readonly tokenKind: "If";
}

export interface ThenToken {
  readonly tokenKind: "Then";
}

export interface ElseToken {
  readonly tokenKind: "Else";
}

export interface LetToken {
  readonly tokenKind: "Let";
}

export interface RecToken {
  readonly tokenKind: "Rec";
}

export interface InToken {
  readonly tokenKind: "In";
}

export interface FunToken {
  readonly tokenKind: "Fun";
}

export interface VariableToken {
  readonly tokenKind: "Variable";
  readonly value: string;
}

export type Token =
  | NumberToken
  | BoolToken
  | LeftParenthesisToken
  | RightParenthesisToken
  | PlusToken
  | MinusToken
  | TimesToken
  | LessThanToken
  | EqualToken
  | RightArrowToken
  | IfToken
  | ThenToken
  | ElseToken
  | LetToken
  | RecToken
  | InToken
  | FunToken
  | VariableToken;

export type TokenKind = Token["tokenKind"];
export type Tokens = Token[];

type ExceptFalsy<T> = T extends 0 | null | undefined | false ? never : T;

type MatchClause<T> = [() => T, (v: ExceptFalsy<T>) => any];

class Matcher {
  private clauses: MatchClause<any>[] = [];
  private defaultAction = () => {};

  match<T>(condition: () => T, action: (v: ExceptFalsy<T>) => any) {
    this.clauses.push([condition, action]);
    return this;
  }

  default(action: () => any) {
    this.defaultAction = action;
    return this;
  }

  exec() {
    const hit = this.clauses.some(([cond, action]) => {
      const r = cond();
      if (r) action(r);
      return !!r;
    });
    if (!hit) {
      this.defaultAction();
    }
    return hit;
  }
}

function reservedWord(input: string, word: string) {
  if (!input.startsWith(word)) return false;
  if (!input.slice(word.length).match(/^[a-zA-Z0-9_\$]/)) {
    return word.length;
  } else {
    return false;
  }
}

function integer(input: string) {
  const hit = input.match(/^(\d+)/);
  if (!hit) return false;
  const v = Number.parseInt(hit[1], 10);
  return [v, hit[1]] as const;
}

function variable(input: string) {
  const hit = input.match(/^([a-zA-Z\$_][a-zA-Z\$_0-9]*)/);
  if (!hit) return false;
  return hit[1];
}

export function tokenize(input: string) {
  const tokens: Tokens = [];

  const matcher = new Matcher()
    .match(
      () =>
        input.startsWith(" ") ||
        input.startsWith("\n") ||
        input.startsWith("\t"),
      () => (input = input.slice(1))
    )
    .match(
      () => input.startsWith("\r\n"),
      () => (input = input.slice(2))
    )
    .match(
      () => reservedWord(input, "fun"),
      (v) => {
        tokens.push({ tokenKind: "Fun" });
        input = input.slice(v);
      }
    )
    .match(
      () => reservedWord(input, "let"),
      (v) => {
        tokens.push({ tokenKind: "Let" });
        input = input.slice(v);
      }
    )
    .match(
      () => reservedWord(input, "rec"),
      (v) => {
        tokens.push({ tokenKind: "Rec" });
        input = input.slice(v);
      }
    )
    .match(
      () => reservedWord(input, "in"),
      (v) => {
        tokens.push({ tokenKind: "In" });
        input = input.slice(v);
      }
    )
    .match(
      () => reservedWord(input, "true"),
      (v) => {
        tokens.push({ tokenKind: "Boolean", value: true });
        input = input.slice(v);
      }
    )
    .match(
      () => reservedWord(input, "false"),
      (v) => {
        tokens.push({ tokenKind: "Boolean", value: false });
        input = input.slice(v);
      }
    )
    .match(
      () => reservedWord(input, "if"),
      (v) => {
        tokens.push({ tokenKind: "If" });
        input = input.slice(v);
      }
    )
    .match(
      () => reservedWord(input, "then"),
      (v) => {
        tokens.push({ tokenKind: "Then" });
        input = input.slice(v);
      }
    )
    .match(
      () => reservedWord(input, "else"),
      (v) => {
        tokens.push({ tokenKind: "Else" });
        input = input.slice(v);
      }
    )
    .match(
      () => input.startsWith("->"),
      () => {
        tokens.push({ tokenKind: "RightArrow" });
        input = input.slice(2);
      }
    )
    .match(
      () => input.startsWith("("),
      () => {
        tokens.push({ tokenKind: "LeftParenthesis" });
        input = input.slice(1);
      }
    )
    .match(
      () => input.startsWith(")"),
      () => {
        tokens.push({ tokenKind: "RightParenthesis" });
        input = input.slice(1);
      }
    )
    .match(
      () => input.startsWith("+"),
      () => {
        tokens.push({ tokenKind: "Plus" });
        input = input.slice(1);
      }
    )
    .match(
      () => input.startsWith("-"),
      () => {
        tokens.push({ tokenKind: "Minus" });
        input = input.slice(1);
      }
    )
    .match(
      () => input.startsWith("*"),
      () => {
        tokens.push({ tokenKind: "Times" });
        input = input.slice(1);
      }
    )
    .match(
      () => input.startsWith("<"),
      () => {
        tokens.push({ tokenKind: "LessThan" });
        input = input.slice(1);
      }
    )
    .match(
      () => input.startsWith("="),
      () => {
        tokens.push({ tokenKind: "Equal" });
        input = input.slice(1);
      }
    )
    .match(
      () => integer(input),
      ([value, strValue]) => {
        tokens.push({ tokenKind: "Number", value });
        input = input.slice(strValue.length);
      }
    )
    .match(
      () => variable(input),
      (value) => {
        tokens.push({ tokenKind: "Variable", value });
        input = input.slice(value.length);
      }
    )
    .default(() => {
      throw new Error("invalid input: " + input);
    });

  while (input.length > 0) {
    matcher.exec();
  }
  return tokens;
}
