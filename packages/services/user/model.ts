import { z } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe("The full name of the user"),
    email: z.string().email().describe("The email address of the user"),
    password: z.string().min(8).describe("The password for the user, must be at least 8 characters long"),
});

export const signInUserWithEmailAndPasswordInput = z.object({
    email: z.email().describe("The email address of the user"),
    password: z.string().min(8).describe("The password for the user, must be at least 8 characters long"),
});

export const generateUserTokenPayload = z.object({
    id: z.string().describe("The unique identifier of the user"),
})

export type CreateUserWithEmailAndPasswordType = z.infer<typeof createUserWithEmailAndPasswordInput>;
export type SignInUserWithEmailAndPasswordType = z.infer<typeof signInUserWithEmailAndPasswordInput>;
export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;