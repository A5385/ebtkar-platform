import z from "zod";

export const strongPasswordValidator = z
  .string()
  .min(8, { error: "password_must_at_least_8_character" })
  .check(({ value, ...ctx }) => {
    if (!/[A-Z]/.test(value)) {
      ctx.issues.push({
        code: "custom",
        input: value,
        message: "password_must_contain_at_least_one_upper_case_character",
      });
    }
    if (!/[a-z]/.test(value)) {
      ctx.issues.push({
        code: "custom",
        input: value,
        message: "password_must_contain_at_least_one_lower_case_character",
      });
    }
    if (!/[0-9]/.test(value)) {
      ctx.issues.push({
        code: "custom",
        input: value,
        message: "password_must_contain_at_least_one_digit_number",
      });
    }
    if (!/[\W_]/.test(value)) {
      ctx.issues.push({
        code: "custom",
        input: value,
        message: "password_must_contain_at_least_one_special_character",
      });
    }
  });

const email = z.email({ message: "invalid_email" });
export const RegisterSchemaInput = z.object({
  email,
  password: strongPasswordValidator,
});

export const ChangeUserPasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: strongPasswordValidator,
});
