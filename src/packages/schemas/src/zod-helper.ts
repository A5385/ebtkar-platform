import z from 'zod';

export const emailValidation = z
    .email({ error: 'invalid_email' })
    .transform((email) => email.toLowerCase());

export const strongPasswordValidation = z
    .string()
    .min(12, { error: 'password_must_be_at_least_12_characters' })
    .max(20, { error: 'password_must_not_exceed_20_characters' })
    .regex(/[A-Z]/, {
        error: 'password_must_contain_at_least_one_uppercase_character',
    })
    .regex(/[a-z]/, {
        error: 'password_must_contain_at_least_one_lowercase_character',
    })
    .regex(/\d/, {
        error: 'password_must_contain_at_least_one_digit',
    })
    .regex(/[^\p{L}\p{N}\s]/u, {
        error: 'password_must_contain_at_least_one_special_character',
    });
