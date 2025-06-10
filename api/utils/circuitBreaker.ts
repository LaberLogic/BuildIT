import CircuitBreaker from "opossum";

export const getCircuitState = (
  breaker: CircuitBreaker,
): "CLOSED" | "OPEN" | "HALF_OPEN" | "UNKNOWN" => {
  if (breaker.closed) return "CLOSED";
  if (breaker.opened) return "OPEN";
  if (breaker.halfOpen) return "HALF_OPEN";
  return "UNKNOWN";
};
