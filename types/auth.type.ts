import z from "zod";
import { loginFormSchema, registerFormSchema } from "../schema/auth.schema";

export type LoginFormType = z.infer<typeof loginFormSchema>;
export type RegisterFormType = z.infer<typeof registerFormSchema>;