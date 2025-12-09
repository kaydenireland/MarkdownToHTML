export class Logger {

    private indent: number;
    private readonly _debug: boolean;
    private readonly INDENT: number = 2;

    public constructor(_debug: boolean) {
        this.indent = 0;
        this._debug = _debug;
    }

    public info(message: string): void {
        if (this._debug) {
            console.log("%s%s", "\t".repeat(this.indent), message);
        }
    }

    public clear(): void {
        if (this._debug){
            console.clear();
        }
    }

    public increaseIndent(): void {
        this.indent += this.INDENT;
    }

    public decreaseIndent(): void {
        this.indent -= this.INDENT;
    }
}