import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { userService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import {
  getAuthenticationCookie,
  setAuthenticationCookie,
  clearAuthenticationCookie,
} from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputSchema,
  createUserWithEmailAndPasswordOutputSchema,
  getUserInfoOutputSchema,
  signInUserWithEmailAndPasswordInputSchema,
  signInUserWithEmailAndPasswordOutputSchema,
  getUserInfoInputSchema,
} from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  signOut: publicProcedure
    .input(z.void())
    .output(z.object({ success: z.literal(true) }))
    .mutation(({ ctx }) => {
      clearAuthenticationCookie(ctx);
      return { success: true as const };
    }),
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createUserWithEmailAndPassword"),
        tags: TAGS,
        summary: "Create a new user with email and password",
      },
    })
    .input(createUserWithEmailAndPasswordInputSchema)
    .output(createUserWithEmailAndPasswordOutputSchema)
    .mutation(async ({ input }) => {
      const { fullName, email, password } = input;
      const { id } = await userService.createUserWithEmailAndPassword({
        fullName,
        email,
        password,
      });
      return { id };
    }),

  signInUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/signInUserWithEmailAndPassword"),
        tags: TAGS,
        summary: "Sign in a user with email and password",
      },
    })
    .input(signInUserWithEmailAndPasswordInputSchema)
    .output(signInUserWithEmailAndPasswordOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, token } = await userService.signInUserWithEmailAndPassword(input);
      setAuthenticationCookie(ctx, token);
      return { id };
    }),

  getUserInfo: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getUserInfo"),
        tags: TAGS,
        summary: "Get user info",
      },
    })
    .input(getUserInfoInputSchema)
    .output(getUserInfoOutputSchema)
    .query(async ({ ctx }) => {
      const userToken = getAuthenticationCookie(ctx);
      if (!userToken) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Please sign in to continue" });
      }
      const { id, email, fullName } = await userService
        .verifyUserToken(userToken)
        .catch((error: unknown) => {
          if (
            error instanceof Error &&
            (error.message === "Invalid token" || error.message === "User not found")
          )
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Your session has expired. Please sign in again.",
            });
          throw error;
        });
      return { id: id!, email: email!, fullName: fullName! };
    }),
});
