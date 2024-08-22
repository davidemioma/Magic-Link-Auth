import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { magicLinkTokens, emailChangeVerificationTokens } from "../db/schema";

export const getMagicLinkTokenByEmail = async (email: string) => {
  const magicLinkToken = await db
    .select({
      id: magicLinkTokens.id,
    })
    .from(magicLinkTokens)
    .where(eq(magicLinkTokens.email, email))
    .then((res) => res[0]);

  return magicLinkToken;
};

export const getMagicLinkTokenByToken = async (token: string) => {
  const magicLinkToken = await db
    .select({
      id: magicLinkTokens.id,
      email: magicLinkTokens.email,
      expires: magicLinkTokens.expires,
    })
    .from(magicLinkTokens)
    .where(eq(magicLinkTokens.token, token))
    .then((res) => res[0]);

  return magicLinkToken;
};

export const getEmailChangeVerificationTokenByEmail = async ({
  oldEmail,
  newEmail,
}: {
  oldEmail: string;
  newEmail: string;
}) => {
  const verficationToken = await db
    .select({
      id: emailChangeVerificationTokens.id,
    })
    .from(emailChangeVerificationTokens)
    .where(
      and(
        eq(emailChangeVerificationTokens.oldEmail, oldEmail),
        eq(emailChangeVerificationTokens.newEmail, newEmail)
      )
    )
    .then((res) => res[0]);

  return verficationToken;
};

export const getEmailChangeVerificationTokenByToken = async (token: string) => {
  const verficationToken = await db
    .select({
      id: emailChangeVerificationTokens.id,
      oldEmail: emailChangeVerificationTokens.oldEmail,
      newEmail: emailChangeVerificationTokens.newEmail,
      expires: emailChangeVerificationTokens.expires,
    })
    .from(emailChangeVerificationTokens)
    .where(eq(emailChangeVerificationTokens.token, token))
    .then((res) => res[0]);

  return verficationToken;
};
