const inspect = Symbol.for("nodejs.util.inspect.custom");

export class ChainedError extends Error {
  public static readonly INDENTATION = "  ";
  public static readonly DELIMITER = "\n";
  public static readonly PREAMBLE = "Full Trace:\n";

  private messageStack: string[] = [];
  public errorCode?: number;

  constructor(error?: unknown, errorCode?: number) {
    super();
    Error.captureStackTrace(this, ChainedError);
    this.name = "ChainedError";
    this.message = `${ChainedError.PREAMBLE}empty`;
    if (error) this.chain(error);
    if (errorCode !== undefined) this.errorCode = errorCode;
  }

  get getMessageStack() {
    return this.messageStack;
  }

  public chain(messageOrError: string | unknown) {
    if (typeof messageOrError === "string") {
      this.messageStack.push(messageOrError);
    } else if (messageOrError instanceof ChainedError) {
      this.messageStack = messageOrError.getMessageStack.concat(
        this.messageStack,
      );
      if (
        this.errorCode === undefined &&
        messageOrError.errorCode !== undefined
      ) {
        this.errorCode = messageOrError.errorCode;
      }
    } else if (messageOrError instanceof Error) {
      this.stack = messageOrError.stack;
      this.messageStack.push(
        `${messageOrError.name}: ${messageOrError.message}`,
      );
    } else {
      throw new Error(
        `Received something else than an error or a string: ${messageOrError}`,
      );
    }
    this.updateMessage();
    return this;
  }

  private updateMessage() {
    this.message = this.messageStack.reduceRight(
      (previous, current, index, array) =>
        `${previous}${ChainedError.formatMessage(
          current,
          Math.abs(index - array.length),
        )}`,
      ChainedError.PREAMBLE,
    );
  }

  protected static formatMessage(message: string, level: number) {
    const indentation = ChainedError.INDENTATION.repeat(level);
    const delimiter = level !== 0 ? ChainedError.DELIMITER : "";
    return `${indentation}${message}${delimiter}`;
  }

  public toString() {
    return `${this.name}: ${this.message}`;
  }

  [inspect]() {
    return this.toString();
  }
}
