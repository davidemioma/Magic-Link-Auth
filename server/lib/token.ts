import { db } from "../db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { emailChangeVerificationTokens, magicLinkTokens } from "../db/schema";
import {
  getEmailChangeVerificationTokenByEmail,
  getMagicLinkTokenByEmail,
} from "./util";

export const generateMagicLinkToken = async (email: string) => {
  const token = uuidv4();

  //This is expiring in 10 mins.
  const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

  //Check if there is an existing verification token for this email.
  const existingToken = await getMagicLinkTokenByEmail(email);

  //Delete existing token
  if (existingToken) {
    await db
      .delete(magicLinkTokens)
      .where(eq(magicLinkTokens.id, existingToken.id));
  }

  //Create a new token.
  const verficationToken = await db
    .insert(magicLinkTokens)
    .values({ email, token, expires })
    .returning({
      id: magicLinkTokens.id,
      email: magicLinkTokens.email,
      token: magicLinkTokens.token,
    })
    .then((res) => res[0]);

  return verficationToken;
};

export const generateEmailChangeVerificationToken = async ({
  oldEmail,
  newEmail,
}: {
  oldEmail: string;
  newEmail: string;
}) => {
  const token = uuidv4();

  //This is expiring in 10 mins.
  const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

  //Check if there is an existing verification token for this email.
  const existingToken = await getEmailChangeVerificationTokenByEmail({
    oldEmail,
    newEmail,
  });

  //Delete existing token
  if (existingToken) {
    await db
      .delete(emailChangeVerificationTokens)
      .where(eq(emailChangeVerificationTokens.id, existingToken.id));
  }

  //Create a new token.
  const verficationToken = await db
    .insert(emailChangeVerificationTokens)
    .values({ oldEmail, newEmail, token, expires })
    .returning({
      id: emailChangeVerificationTokens.id,
      oldEmail: emailChangeVerificationTokens.oldEmail,
      newEmail: emailChangeVerificationTokens.newEmail,
      token: emailChangeVerificationTokens.token,
    })
    .then((res) => res[0]);

  return verficationToken;
};
