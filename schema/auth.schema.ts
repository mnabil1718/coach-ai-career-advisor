import { z } from "zod";

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must be at most 15 characters")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character");


export const loginFormSchema = z.object({
    email: z.email(),
    password: z.string(),
});


export const registerFormSchema = z.object({
    email: z.string(),
    password: passwordSchema,
    password_confirmation: z.string(),
}).superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
        ctx.addIssue({
            code: 'custom',
            message: 'must match password above',
            path: ["password_confirmation"],
        })
    }
});

