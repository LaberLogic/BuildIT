import { mailBreaker, mailgunClient } from "@src/mail/mail.sender";
import { getCircuitState } from "@utils/circuitBreaker";
import { FastifyReply, FastifyRequest } from "fastify";

/**
 * Health check endpoint for monitoring the mail service and circuit breaker state.
 *
 * Checks the availability of Mailgun API and the status of the email circuit breaker.
 * Returns HTTP 200 if Mailgun is reachable and circuit breaker is closed (healthy),
 * otherwise returns HTTP 500 with degraded status.
 *
 * @param {FastifyRequest} request - The incoming Fastify request object.
 * @param {FastifyReply} reply - The Fastify reply object to send the response.
 * @returns {Promise<FastifyReply>} JSON response containing health status of services, uptime, and response time.
 */
export const healthCheck = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
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
