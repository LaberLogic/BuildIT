import { getCircuitState } from "@utils/circuitBreaker";
import CircuitBreaker from "opossum";

describe("getCircuitState with opossum breaker", () => {
  it("should return CLOSED if breaker is closed", () => {
    const breaker = {
      get closed() {
        return true;
      },
      get opened() {
        return false;
      },
      get halfOpen() {
        return false;
      },
    } as unknown as CircuitBreaker;
    expect(getCircuitState(breaker)).toBe("CLOSED");
  });

  it("should return OPEN if breaker is opened", () => {
    const breaker = {
      get closed() {
        return false;
      },
      get opened() {
        return true;
      },
      get halfOpen() {
        return false;
      },
    } as unknown as CircuitBreaker;
    expect(getCircuitState(breaker)).toBe("OPEN");
  });

  it("should return HALF_OPEN if breaker is halfOpen", () => {
    const breaker = {
      get closed() {
        return false;
      },
      get opened() {
        return false;
      },
      get halfOpen() {
        return true;
      },
    } as unknown as CircuitBreaker;
    expect(getCircuitState(breaker)).toBe("HALF_OPEN");
  });

  it("should return UNKNOWN if breaker is in an unexpected state", () => {
    const breaker = {
      get closed() {
        return false;
      },
      get opened() {
        return false;
      },
      get halfOpen() {
        return false;
      },
    } as unknown as CircuitBreaker;
    expect(getCircuitState(breaker)).toBe("UNKNOWN");
  });
});
