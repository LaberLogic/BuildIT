import { env } from "@env";
import {
  buildAndSendEmail,
  mailBreaker,
  mailgunClient,
  sendEmail,
} from "@src/mail/mail.sender";
import { ChainedError } from "@utils/chainedError";

jest.mock("@env", () => ({
  env: {
    MAILGUN_API_KEY: "fake-api-key",
    MAILGUN_DOMAIN: "fake-domain.com",
    USE_DEFAULT_EMAIL_RECEIVER: false,
    DEFAULT_RECEIVER_EMAIL: "default@fake.com",
    SKIP_EMAIL_SENDING: false,
  },
}));

const sendMock = jest.fn();

mailgunClient.messages = {
  create: sendMock,
};

jest.mock("opossum", () => {
  return jest.fn().mockImplementation((fn, options) => {
    return {
      fire: jest.fn((...args) => fn(...args)),
      options,
    };
  });
});

describe("buildAndSendEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if neither text nor template is provided", async () => {
    const params = {
      to: "user@example.com",
      subject: "Hello",
    };
    const result = await sendEmail(params); // Using sendEmail since buildAndSendEmail is sync, adjust accordingly if needed
    expect(result.isErr()).toBe(true);
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(ChainedError);
    expect(err.message).toMatch(
      /Either 'template' or non-empty 'text' must be provided/,
    );
  });

  it("sends email with correct payload when text is provided without template or variables", () => {
    const params = {
      to: "user@example.com",
      subject: "Hello",
      text: "Hello world",
    };

    buildAndSendEmail(params);

    expect(sendMock).toHaveBeenCalledWith(
      env.MAILGUN_DOMAIN,
      expect.objectContaining({
        from: `Construxx <no-reply@${env.MAILGUN_DOMAIN}>`,
        to: params.to,
        subject: params.subject,
        text: params.text,
      }),
    );
  });

  it("uses default receiver if USE_DEFAULT_EMAIL_RECEIVER is true", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (env as any).USE_DEFAULT_EMAIL_RECEIVER = true;

    const params = {
      to: "user@example.com",
      subject: "Hello",
      text: "Hello world",
    };

    buildAndSendEmail(params);

    expect(sendMock).toHaveBeenCalledWith(
      env.MAILGUN_DOMAIN,
      expect.objectContaining({
        to: env.DEFAULT_RECEIVER_EMAIL,
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (env as any).USE_DEFAULT_EMAIL_RECEIVER = false;
  });

  it("includes template and variables if provided", () => {
    const params = {
      to: "user@example.com",
      subject: "Hello",
      template: "welcome",
      variables: { firstName: "John" },
    };

    buildAndSendEmail(params);

    expect(sendMock).toHaveBeenCalledWith(
      env.MAILGUN_DOMAIN,
      expect.objectContaining({
        template: "welcome",
        "h:X-Mailgun-Variables": JSON.stringify(params.variables),
      }),
    );
  });
});

describe("sendEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if neither text nor template is provided", async () => {
    const params = {
      to: "test@example.com",
      subject: "Test",
    };

    const result = await sendEmail(params);
    expect(result.isErr()).toBe(true);
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(ChainedError);
    expect(err.message).toMatch(
      /Either 'template' or non-empty 'text' must be provided/,
    );
  });

  it("calls mailBreaker.fire and resolves with null on success", async () => {
    (mailBreaker.fire as jest.Mock) = jest.fn().mockResolvedValue("success");

    const params = {
      to: "test@example.com",
      subject: "Test",
      text: "Hello",
    };

    const result = await sendEmail(params);

    expect(mailBreaker.fire).toHaveBeenCalledWith(params);
    expect(result).toEqual({ value: null });
  });

  it("maps mailBreaker.fire rejection to ChainedError", async () => {
    const error = new ChainedError("fail");
    (mailBreaker.fire as jest.Mock) = jest.fn().mockRejectedValue(error);

    const params = {
      to: "test@example.com",
      subject: "Test",
      text: "Hello",
    };

    const result = await sendEmail(params);
    expect(result.isErr()).toBe(true);
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(ChainedError);
    expect(err.message).toEqual(error.message);
  });

  it("calls template if provided", async () => {
    (mailBreaker.fire as jest.Mock) = jest.fn().mockResolvedValue("success");

    const params = {
      to: "test@example.com",
      template: "test",
      subject: "Test",
      text: "Hello",
    };

    const result = await sendEmail(params);

    expect(mailBreaker.fire).toHaveBeenCalledWith(params);
    expect(result).toEqual({ value: null });
  });
});
