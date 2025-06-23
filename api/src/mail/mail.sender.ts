import { env } from "@env";
import { ChainedError } from "@utils/chainedError";
import { fastify } from "fastify";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { okAsync, ResultAsync } from "neverthrow";
import opossum from "opossum";

const logger = fastify().log;

const mg = new Mailgun(formData);
/**
 * Mailgun client initialized with API key and username.
 */
export const mailgunClient = mg.client({
  username: "api",
  key: env.MAILGUN_API_KEY,
});

export type SendEmailParams = {
  to: string;
  subject: string;
  text?: string;
  template?: string;
  variables?: Record<string, unknown>;
};

/**
 * Builds the email payload and sends it using Mailgun.
 *
 * If a template is provided, it will use the template and variables.
 * Otherwise, it requires non-empty text content.
 *
 * If environment variable `USE_DEFAULT_EMAIL_RECEIVER` is set, the email
 * will be sent to the default receiver instead of the provided `to` address.
 *
 * @param {SendEmailParams} params - Email sending parameters.
 * @throws Will throw an error if neither a template nor a non-empty text is provided, or if the email fails to send.
 */
export const buildAndSendEmail = async (params: SendEmailParams) => {
  const { subject, text, template, variables } = params;

  const recipient = env.USE_DEFAULT_EMAIL_RECEIVER
    ? env.DEFAULT_RECEIVER_EMAIL
    : params.to;

  const basePayload = {
    from: `Construxx <no-reply@${env.MAILGUN_DOMAIN}>`,
    to: recipient,
    subject,
  };

  let payload;

  if (template) {
    payload = {
      ...basePayload,
      template,
      "h:X-Mailgun-Variables": JSON.stringify(variables ?? {}),
    };
  } else if (text?.trim()) {
    payload = {
      ...basePayload,
      text,
    };
  } else {
    logger.error("Email rejected: Missing template or text content.");
    throw new Error("Either 'template' or non-empty 'text' must be provided.");
  }

  logger.info({
    msg: "Sending email via Mailgun",
    to: recipient,
    subject,
    template: template || undefined,
    usingTemplate: Boolean(template),
  });

  try {
    const response = await mailgunClient.messages.create(
      env.MAILGUN_DOMAIN,
      payload,
    );
    logger.info({ msg: "Email sent successfully", id: response?.id });
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(
      {
        msg: "Mailgun email send failed",
        error: error?.message,
        status: error?.status,
        body: error?.response?.body,
      },
      "Mailgun error",
    );
    throw error;
  }
};

/**
 * Circuit breaker around the email sending function to improve resilience.
 *
 * Configured with:
 * - timeout: 5000ms
 * - errorThresholdPercentage: 50%
 * - resetTimeout: 10000ms
 */
export const mailBreaker = new opossum(buildAndSendEmail, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
});

/**
 * Sends an email using the circuit breaker and returns a ResultAsync for safe error handling.
 *
 * If `SKIP_EMAIL_SENDING` is true in environment variables, resolves immediately with null.
 *
 * @param {SendEmailParams} params - Email sending parameters.
 * @returns {ResultAsync<null, ChainedError>} ResultAsync resolving to null on success,
 * or an error of type ChainedError on failure.
 */
export const sendEmail = (
  params: SendEmailParams,
): ResultAsync<null, ChainedError> => {
  if (env.SKIP_EMAIL_SENDING === true) {
    logger.info("Email sending skipped via SKIP_EMAIL_SENDING=true.");
    return okAsync(null);
  }

  return ResultAsync.fromPromise(mailBreaker.fire(params), (e) => {
    logger.error({ msg: "Circuit breaker triggered", error: e });
    return new ChainedError(e);
  }).map(() => null);
};
