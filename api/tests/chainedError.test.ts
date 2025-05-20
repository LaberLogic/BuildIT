import { ChainedError } from "../utils/chainedError";
import { inspect } from "util";

const firstIndent = ChainedError.INDENTATION;
const secondIndent = ChainedError.INDENTATION.repeat(2);
const thirdIndent = ChainedError.INDENTATION.repeat(3);

describe("ChainedError gets properly constructed, chains and outputs", () => {
  const firstMessage = "inner msg";
  const secondMessage = "mid msg";
  const thirdMessage = "outer msg";

  test("can be constructed from existing ChainedError", () => {
    const e1 = new ChainedError(firstMessage);
    const e2 = new ChainedError(e1).chain(secondMessage);
    const e3 = new ChainedError(e2).chain(thirdMessage);

    expect(e3.toString()).toContain(
      `${ChainedError.DELIMITER}${firstIndent}${thirdMessage}` +
        `${ChainedError.DELIMITER}${secondIndent}${secondMessage}` +
        `${ChainedError.DELIMITER}${thirdIndent}${firstMessage}`,
    );
  });

  test("can be constructed from other errors", () => {
    const e1 = new Error(firstMessage);
    const e2 = new ChainedError(e1).chain(secondMessage);

    expect(e2.toString()).toContain(
      `${ChainedError.DELIMITER}${firstIndent}${secondMessage}${ChainedError.DELIMITER}${secondIndent}Error: ${firstMessage}`,
    );
  });

  test("constructing with something other than an error throws", () => {
    expect(() => new ChainedError({})).toThrow();
  });

  test("returns custom string representation", () => {
    const err = new ChainedError("Something went wrong");
    const inspected = inspect(err);

    expect(inspected).toBe(err.toString());
  });
});
