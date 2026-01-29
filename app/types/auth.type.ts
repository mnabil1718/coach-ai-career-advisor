import z from "zod";
import { loginFormSchema } from "../validators/auth.validator";

export type LoginFormType = z.infer<typeof loginFormSchema>;