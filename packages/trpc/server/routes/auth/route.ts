
import { userService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { setAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import { createUserWithEmailAndPasswordInputSchema, createUserWithEmailAndPasswordOutputSchema, signInUserWithEmailAndPasswordInputSchema, signInUserWithEmailAndPasswordOutputSchema } from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure.meta({openapi: {
    method: "POST",
    path: getPath("/createUserWithEmailAndPassword"),
    tags: TAGS,
    summary: "Create a new user with email and password",
  }}).input(createUserWithEmailAndPasswordInputSchema).output(createUserWithEmailAndPasswordOutputSchema).mutation(async({ctx, input}) => {
    const { fullName, email, password } = input;
    const { id, token } = await userService.createUserWithEmailAndPassword({ fullName, email, password });
    setAuthenticationCookie(ctx, token);
    return { id };
  }),

  signInUserWithEmailAndPassword: publicProcedure.meta({openapi: {
    method: "POST",
    path: getPath("/signInUserWithEmailAndPassword"),
    tags: TAGS,
    summary: "Sign in a user with email and password",
  }}).input(signInUserWithEmailAndPasswordInputSchema).output(signInUserWithEmailAndPasswordOutputSchema).mutation(async({ctx, input}) => {
    const { id, token } = await userService.signInUserWithEmailAndPassword(input);
    setAuthenticationCookie(ctx, token);
    return { id };
  }),
});
