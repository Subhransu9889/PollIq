import {z} from "zod";

export const createUserWithEmailAndPasswordInputSchema = z.object({
  fullName: z.string().describe("The full name of the user"),
  email: z.email().describe("The email address of the user"),
  password: z.string().min(8).describe("The password for the user, must be at least 8 characters long"),
});

export const createUserWithEmailAndPasswordOutputSchema = z.object({
  id: z.string().describe("The id of the user"),
});

export const signInUserWithEmailAndPasswordInputSchema = z.object({
  email: z.email().describe("The email address of the user"),
  password: z.string().min(8).describe("The password for the user, must be at least 8 characters long"),
});

export const signInUserWithEmailAndPasswordOutputSchema = z.object({
  id: z.string().describe("The id of the user"),
});

export const getUserInfoInputSchema = z.undefined();
export const getUserInfoOutputSchema = z.object({
  id: z.string().describe("The id of the user"),
  email: z.string().email().describe("The email address of the user"),
  fullName: z.string().describe("The full name of the user"),
});