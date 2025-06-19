import { env } from "@env";
import { ROLE } from "@prisma/prisma";
import { sendEmail } from "@src/mail/mail.sender";
import {
  sendInvitationMail,
  sendResetPasswordMail,
} from "@src/mail/mail.service";
import { ChainedError } from "@utils/chainedError";
import jwt from "jsonwebtoken";
import { err, ok } from "neverthrow";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("@src/mail/mail.sender", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("@env", () => ({
  env: {
    JWT_SECRET: "test-secret",
  },
}));

describe("sendInvitationMail", () => {
  const mockUser = {
    email: "invite@example.com",
    firstName: "Jane",
    lastName: "Doe",
    role: "ADMIN" as ROLE,
    status: "PENDING",
    id: "user-id-123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("generates token and sends invitation email successfully", async () => {
    (jwt.sign as jest.Mock).mockReturnValue("mock-token");
    (sendEmail as jest.Mock).mockReturnValue(ok(null));

    const result = (await sendInvitationMail(mockUser))._unsafeUnwrap();

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, role: mockUser.role },
      env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    expect(sendEmail).toHaveBeenCalledWith({
      to: "jonas-labermeier@web.de",
      subject: "Welcome to Construx",
      template: "invitation",
      variables: {
        firstName: mockUser.firstName,
        actionUrl: `http://localhost:3000/set-password?token=mock-token`,
      },
    });

    expect(result).toBe(null);
  });

  it("returns ChainedError if sendEmail fails", async () => {
    const originalError = new Error("email failed");
    (jwt.sign as jest.Mock).mockReturnValue("mock-token");
    (sendEmail as jest.Mock).mockReturnValue(err(originalError));

    const result = await sendInvitationMail(mockUser);

    expect(result.isErr()).toBe(true);
    const chained = result._unsafeUnwrapErr();
    expect(chained).toBeInstanceOf(ChainedError);
    expect(chained.message).toBe(new ChainedError(originalError).message);
  });
});

describe("sendResetPasswordMail", () => {
  const mockUser = {
    email: "reset@example.com",
    firstName: "John",
    role: "USER" as ROLE,
    id: "reset-id-456",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("generates token and sends reset password email successfully", async () => {
    (jwt.sign as jest.Mock).mockReturnValue("reset-token");
    (sendEmail as jest.Mock).mockReturnValue(ok(null));

    const result = await (
      await sendResetPasswordMail(mockUser)
    )._unsafeUnwrap();

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, role: mockUser.role },
      env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    expect(sendEmail).toHaveBeenCalledWith({
      to: mockUser.email,
      subject: "Reset Your Password",
      template: "reset password",
      variables: {
        firstName: mockUser.firstName,
        actionUrl: `http://localhost:3000/set-password?token=reset-token`,
      },
    });

    expect(result).toBe(null);
  });

  it("returns ChainedError if sendEmail fails", async () => {
    const originalError = new Error("send failed");
    (jwt.sign as jest.Mock).mockReturnValue("reset-token");
    (sendEmail as jest.Mock).mockReturnValue(err(originalError));

    const result = await sendResetPasswordMail(mockUser);

    expect(result.isErr()).toBe(true);
    const chained = result._unsafeUnwrapErr();
    expect(chained).toBeInstanceOf(ChainedError);
    expect(chained.message).toBe(new ChainedError(originalError).message);
  });
});
