import { env } from "@env";
import { ChainedError } from "@utils/chainedError";
import mailgun from "mailgun-js";
import { ResultAsync } from "neverthrow";
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

export const mailBreaker = new opossum(
  (params: SendEmailParams) => {
    const { to, subject, template, variables } = params;

    const messagePayload: {
      from: string;
      to: string;
      subject: string;
      template?: string;
      "h:X-Mailgun-Variables"?: string;
    } = {
      from: `Construxx <no-reply@${env.MAILGUN_DOMAIN}>`,
      to,
      subject,
    };

    if (template) {
      messagePayload.template = template;
      if (variables) {
        messagePayload["h:X-Mailgun-Variables"] = JSON.stringify(variables);
      }
    }

    return mailgunClient.messages().send(messagePayload);
  },
  {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
  },
);

export const sendEmail = (
  params: SendEmailParams,
): ResultAsync<null, ChainedError> => {
  return ResultAsync.fromPromise(
    mailBreaker.fire(params),
    (e) => new ChainedError(e),
  ).map(() => null);
};
