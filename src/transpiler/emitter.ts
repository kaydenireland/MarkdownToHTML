import { AST, Node, NodeType, TextNode, HeadingNode, ItalicNode } from "./parser";
import { Logger } from "./log";

type Emitter = {
    log: Logger,
}

export default function emit(ast: AST, emitDebug: boolean, parseDebug: boolean): string {

    let emitter: Emitter = {
        log: new Logger(emitDebug),
    };

    let output: string = "";
    let nodes = ast.body;

    if (!parseDebug) {
        emitter.log.clear();
    }

    emitter.log.info("\n\nConverting to HTML: \n\n");

    emitter.log.info("emit_document()")
    emitter.log.increaseIndent();

    for (const node of nodes) {
        output += emitNode(node, emitter);
    }

    emitter.log.decreaseIndent();

    return output;
}

function emitNode(node: Node, emitter: Emitter, isInLine: boolean = false): string {
    switch (node.type) {
        case NodeType.HEADING: {
            emitter.log.info("emit_heading()");
            emitter.log.increaseIndent();
            let out = emitHeading(node as HeadingNode, emitter);
            emitter.log.decreaseIndent();
            return out;
        }
        case NodeType.ITALIC: {
            emitter.log.info("emit_italic()");
            emitter.log.increaseIndent();
            let out = emitItalic(node as ItalicNode, emitter);
            emitter.log.decreaseIndent();
            return out;
        }
        default: {
            emitter.log.info("emit_text()");
            emitter.log.increaseIndent();
            let out = emitText(node as TextNode, isInLine);
            emitter.log.decreaseIndent();
            return out;
        }
    }
}

function emitHeading(node: HeadingNode, emitter: Emitter): string {
    let level = node.level > 6 ? 6 : node.level;
    let output = `<h${level}>`;

    for (const child of node.content) {
        output += emitNode(child, emitter, true);
    }

    output += `</h${level}>\n`;

    return output;
}

function emitItalic(node: ItalicNode, emitter: Emitter): string {
    let output = "";

    for (const child of node.content) {
        output += emitNode(child, emitter, true);
    }

    return `<em>${output}</em>`;
}

function emitText(node: TextNode, isInline: boolean): string {
    return node.content;
}