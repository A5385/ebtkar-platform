import z from "zod";
import UserSchema from "../generated/modelSchema/UserSchema";

export const loginSchema = UserSchema.pick({
  email: true,
  password: true,
})
  .required({
    email: true,
    password: true,
  })
  .extend({
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long"),
  });
