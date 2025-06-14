import { env } from "@env";
import { ChainedError } from "@utils/chainedError";
import mailgun from "mailgun-js";
import { okAsync, ResultAsync } from "neverthrow";
import opossum from "opossum";

export const mailgunClient = mailgun({
  apiKey: env.MAILGUN_API_KEY,
  domain: env.MAILGUN_DOMAIN,
});

export type SendEmailParams = {
  to: string;
  subject: string;
  text?: string;
  template?: string;
  variables?: Record<string, unknown>;
};

export const buildAndSendEmail = (params: SendEmailParams) => {
  const { subject, template, variables } = params;

  const recipient = env.USE_DEFAULT_EMAIL_RECEIVER
    ? env.DEFAULT_RECEIVER_EMAIL
    : params.to;

  const messagePayload: {
    from: string;
    to: string;
    subject: string;
    template?: string;
    "h:X-Mailgun-Variables"?: string;
  } = {
    from: `Construxx <no-reply@${env.MAILGUN_DOMAIN}>`,
    to: recipient,
    subject,
  };

  if (template) {
    messagePayload.template = template;
    if (variables) {
      messagePayload["h:X-Mailgun-Variables"] = JSON.stringify(variables);
    }
  }

  return mailgunClient.messages().send(messagePayload);
};

export const mailBreaker = new opossum(buildAndSendEmail, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
});

export const sendEmail = (
  params: SendEmailParams,
): ResultAsync<null, ChainedError> => {
  if (env.SKIP_EMAIL_SENDING === true) return okAsync(null);

  return ResultAsync.fromPromise(
    mailBreaker.fire(params),
    (e) => new ChainedError(e),
  ).map(() => null);
};
