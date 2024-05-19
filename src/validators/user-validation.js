import { z } from "zod";

const emailSchema = z
  .string({ required_error: "Email is required" })
  .email({ message: "Invalid email address" })
  .min(2, { message: "Name must be least of two characters" })
  .max(200, { message: "Name must not be more than 200 characters" });

const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(5, { message: "password must be least of eight characters" })
  .max(25, { message: "password must not be more than 25 characters" });

const genderSchema = z.enum(["male", "female", "other"]);

const addressSchema = z
  .string({ required_error: "Adress is required" })
  .trim()
  .min(2, { message: "Adrress must be least of two characters" })
  .max(200, { message: "Adrress must not be more than 200 characters" });

const nameSchema = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(2, { message: "Name must be least of two characters" })
  .max(200, { message: "Name must not be more than 200 characters" });

export const registerSchema = z.object({
  name: nameSchema,
  address: addressSchema,
  gender: genderSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const updateUserSchema = z.object({
  name: nameSchema,
  address: addressSchema,
  gender: genderSchema,
});

export const resetForgotPasswordSchema = z.object({
  password: passwordSchema,
  token: z.string({ required_error: "Token is required" }).trim(),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
