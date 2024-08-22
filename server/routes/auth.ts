import { db } from "../db";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { sendMagicLink } from "../lib/mail";
import { zValidator } from "@hono/zod-validator";
import { generateMagicLinkToken } from "../lib/token";
import { getMagicLinkTokenByToken } from "../lib/util";
import { LoginSchema, VerifyTokenSchema } from "../../types";
import { createSession, destroySession } from "../lib/session";

export const authRoute = new Hono()
  .post("login", zValidator("json", LoginSchema), async (c) => {
    const { email } = await c.req.valid("json");

    // Check if there is an email
    if (!email) {
      return c.json({ error: "User not found" }, 404);
    }

    // Generate Magic Link Token
    const magicLink = await generateMagicLinkToken(email);

    // Send Email
    await sendMagicLink({ email: magicLink.email, token: magicLink.token });

    return c.json({ message: "Magic link has been sent" }, 200);
  })
  .patch(
    "verify-magic-link",
    zValidator("json", VerifyTokenSchema),
    async (c) => {
      const { token } = await c.req.valid("json");

      const tokenExists = await getMagicLinkTokenByToken(token);

      if (!tokenExists || !tokenExists.expires) {
        return c.json({ error: "Token not found" }, 404);
      }

      //Check if token has expired
      const hasExpired = new Date(tokenExists.expires) < new Date();

      if (hasExpired) {
        return c.json({ error: "Token has expired" }, 401);
      }

      //check if user exists
      const userExists = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(eq(users.email, tokenExists.email))
        .then((res) => res[0]);

      //Create User, if user does not exists
      if (!userExists) {
        await db.insert(users).values({
          email: tokenExists.email,
        });
      }

      //Login logic
      await createSession({
        c,
        userId: userExists.id,
      });

      return c.json({ message: "Login successful!" }, 200);
    }
  )
  .get("logout", async (c) => {
    await destroySession({ c });

    return c.json({ message: "Logged out" }, 200);
  });
