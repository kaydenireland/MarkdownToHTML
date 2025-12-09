import { Token, TokenType } from "./lexer";
import { Logger } from "./log";

export enum NodeType {
    HEADING,
    ITALIC,
    TEXT,
}

type BaseNode = {
    type: NodeType
}

export type HeadingNode = BaseNode & {
    level: number,
    content: Node[]
}

export type ItalicNode = BaseNode & {
    content: Node[]
}

export type TextNode = BaseNode & {
    content: string
}

export type Node = HeadingNode | ItalicNode | TextNode;

export type AST = {
    body: Node[]
}

type Parser = {
    tokens: Token[],
    pointer: number,
    log: Logger
}

function advance(parser: Parser): Token | null {
    let next = parser.tokens[parser.pointer];
    parser.pointer++;
    return next;
}

function peek(parser: Parser, amount: number = 0): Token | null {
    return parser.tokens[parser.pointer + amount];
}

export function toString(ast: AST) {
	return JSON.stringify(ast, null, 2);
}

export function parse(tokens: Token[], _debug: boolean): AST {
    let parser: Parser = {
        tokens,
        pointer: 0,
        log: new Logger(_debug)
    };

    parser.log.clear();

    let ast: AST = { body: [] };

    parser.log.info("parse_document()");
    parser.log.increaseIndent();

    while (parser.pointer < tokens.length) {
        let node = parseNode(parser);
        if (!node) continue;

        ast.body.push(node);
    }

    parser.log.decreaseIndent();

    return ast;
}

function parseNode(parser: Parser): Node | null {
    let current = advance(parser);

    switch (current?.type) {
        case TokenType.HEADING: return parseHeading(parser);
        case TokenType.ITALIC: return parseItalic(parser);
        case TokenType.TEXT: {
            parser.log.info("parse_text()");
            return parseText(current);
        }
        case TokenType.NEWLINE: return null;
        default: return null;
    }
}

function parseHeading(parser: Parser): HeadingNode {
    parser.log.info("parse_heading()");
    parser.log.increaseIndent();

    let node: HeadingNode = {
        type: NodeType.HEADING,
        level: 1,
        content: []
    };

    while (true) {
        let next = peek(parser);
        if (!next) break;

        if (next.type === TokenType.HEADING) {
            node.level++;
            advance(parser);
            continue;
        }

        let child = parseNode(parser);
        if (!child) break;
        node.content.push(child);
    }   

    parser.log.decreaseIndent();

    return node;
}

function parseItalic(parser: Parser): ItalicNode {
    parser.log.info("parse_italic()");
    parser.log.increaseIndent();

    let node: ItalicNode = {
        type: NodeType.ITALIC,
        content: []
    };

    while (true) {
        let next = peek(parser);
        if (!next) break;

        // Consume closing italic token
        if (next.type === TokenType.ITALIC) {
            advance(parser);
            break;
        }

        let child = parseNode(parser);
        if (!child) break;
        node.content.push(child);
    }

    parser.log.decreaseIndent();

    return node;
}

function parseText(token: Token): TextNode {
    return { type: NodeType.TEXT, content: token.literal };
}