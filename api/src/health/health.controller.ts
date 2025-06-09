import { mailBreaker, mailgunClient } from "@src/mail/mail.sender";
import { getCircuitState } from "@utils/circuitBreaker";
import { FastifyReply, FastifyRequest } from "fastify";

export const healthCheck = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const startTime = Date.now();

  let mailgunHealthy = false;
  try {
    const result = await mailgunClient.get("/domains");
    mailgunHealthy = Array.isArray(result?.items);
  } catch {
    mailgunHealthy = false;
  }

  const breakerState = getCircuitState(mailBreaker);
  const breakerStats = mailBreaker.status.stats;

  return reply
    .code(mailgunHealthy && breakerState === "CLOSED" ? 200 : 500)
    .send({
      status: mailgunHealthy && breakerState === "CLOSED" ? "ok" : "degraded",
      services: {
        mailgun: mailgunHealthy ? "healthy" : "unreachable",
        emailCircuitBreaker: {
          state: breakerState,
          stats: {
            fires: breakerStats.fires,
            failures: breakerStats.failures,
            successes: breakerStats.successes,
            timeouts: breakerStats.timeouts,
            rejects: breakerStats.rejects,
            percentiles: breakerStats.latencyTimes,
          },
        },
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
    });
};
