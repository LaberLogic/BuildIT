import { env } from "@env";
import { ROLE } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import jwt from "jsonwebtoken";
import { ResultAsync } from "neverthrow";

import { sendEmail } from "./mail.sender";
/**
 * Sends an invitation email with a one-time token link for setting a password.
 *
 * @param user - The user object containing relevant information for the invitation.
 * @returns A ResultAsync indicating success or a ChainedError if the email fails to send.
 */
export const sendInvitationMail = (user: {
  email: string;
  firstName: string;
  lastName: string;
  role: ROLE;
  status: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}): ResultAsync<null, ChainedError> => {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  const actionUrl = `http://localhost:3000/set-password?token=${token}`;

  return sendEmail({
    to: "jonas-labermeier@web.de", // Replace with `user.email` if dynamic
    subject: "Welcome to Construx",
    template: "invitation",
    variables: {
      firstName: user.firstName,
      actionUrl,
    },
  }).mapErr((e) => new ChainedError(e));
};

/**
 * Sends a password reset email with a tokenized link for resetting a password.
 *
 * @param user - The user object containing identifying and contact information.
 * @returns A ResultAsync indicating success or a ChainedError if the email fails to send.
 */
export const sendResetPasswordMail = (user: {
  email: string;
  firstName: string;
  role: ROLE;
  id: string;
}): ResultAsync<null, ChainedError> => {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  const actionUrl = `http://localhost:3000/set-password?token=${token}`;

  return sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    template: "reset password",
    variables: {
      firstName: user.firstName,
      actionUrl,
    },
  }).mapErr((e) => new ChainedError(e));
};
