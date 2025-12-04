export enum TokenType {
    HEADING = "heading",
    TEXT = "text",
    ITALIC = "italic",
    NEWLINE = "newline",
    INVALID = "invalid"
}

export type Token = {
    type: TokenType,
    literal: string
}


export function tokensToString(tokens: Token[]): string {
    return tokens.map(t => `Token(type: ${t.type}, literal: "${t.literal}":)`).join('\n');
}


enum LexerState {
    START,
    TEXT
}

const TOKEN_CHARS: string[] = ['_', '#']

export type Lexer = {
    input: string;
    len: number;
    idx: number;
    buffer: string;
    state: LexerState;
}

export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let len = input.length;
    let idx: number = 0;
    let buffer: string = "";
    let state: LexerState = LexerState.START;

    while (true) {

        if (idx === len) {
            if(buffer !== "") {
                tokens.push( { type: TokenType.TEXT, literal: buffer });
            }
            break;
        }

        let char = input[idx];
        
        switch (state) {
            case LexerState.START: {
                switch (char) {
                    case '#': 
                        tokens.push( { type: TokenType.HEADING, literal: char });
                        break;
                    case '_': 
                        tokens.push( { type: TokenType.ITALIC, literal: char });
                        break;
                    case ' ':
                        break;
                    case '\n': 
                        tokens.push( { type: TokenType.NEWLINE, literal: "\\n" });
                        break;
                    default: 
                        if (!TOKEN_CHARS.includes(char)){
                            state = LexerState.TEXT;
                            buffer += char;
                        }else {
                            tokens.push( { type: TokenType.INVALID, literal: char });
                        }
                    
                }
                break;
            }
            case LexerState.TEXT: {
                if (!TOKEN_CHARS.includes(char)){
                    buffer += char;
                }else {
                    if (TOKEN_CHARS.includes(char) && !shouldBeToken(idx, input)) {
                        buffer += char;
                    } else {
                        state = LexerState.START;
                        idx--;
                        tokens.push( { type: TokenType.TEXT, literal: buffer });
                        buffer = "";
                    }
                }
                
            }
        }
        idx++;
    }
    return tokens;
}


function shouldBeToken(idx: number, input: string): boolean {

    let delimiters: string[] = [' ', '\n'].concat(TOKEN_CHARS);

    if (!TOKEN_CHARS.includes(input[idx])) {
        return false;
    }


    let prev = input[idx - 1] ?? ' ';
    let next = input[idx + 1] ?? ' ';

    return delimiters.includes(prev) || delimiters.includes(next);
}