"use client";

import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleSignInForm } from "@/app/auth/google/sign-in";
import { BackLink } from "./backlink";
import { Or } from "./or";
import { Required } from "../form/required-span";
import { registerFormSchema } from "@/schema/auth.schema";
import { RegisterFormType } from "@/types/auth.type";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { PasswordField } from "../form/password-field";
import { Button } from "../ui/button";
import { register } from "@/services/auth/register.service";
import { toastError } from "@/utils/toast";
import { Brand } from "../brand";
import { useState } from "react";

export function SignUpForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const form = useForm<RegisterFormType>({
        resolver: zodResolver(registerFormSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: "",
            password_confirmation: "",
        },
    });

    const handleSignUp = async (data: RegisterFormType) => {
        setLoading(true);
        const { error } = await register(data);
        if (error) {
            toastError(error);
            setLoading(false);
        }

        setLoading(false);
        router.push("/dashboard");
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <Brand className="text-center mb-3" />
                    <CardTitle className="text-2xl">Sign up</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="signup-form" onSubmit={form.handleSubmit(handleSignUp)}>
                        <FieldGroup className="gap-5">
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email" className="gap-1">
                                            Email
                                            <Required />
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="email@example.com"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <PasswordField
                                name="password"
                                description="Password must be atleast 6 characters long"
                                control={form.control}
                            />
                            <PasswordField
                                label="Password Confirmation"
                                name="password_confirmation"
                                description="Must be the same as password above"
                                control={form.control}
                            />
                        </FieldGroup>
                        <Field orientation="horizontal" className="mt-4 mb-6">
                            <Button disabled={loading} type="submit" form="signup-form" className="w-full">
                                {loading ? "Processing..." : "Create Account"}
                            </Button>
                        </Field>
                    </form>
                    <Or />
                    <GoogleSignInForm />
                    <BackLink>
                        Already have an account?{" "}
                        <Link href="/auth/login" className="underline underline-offset-4">
                            Login
                        </Link>
                    </BackLink>
                </CardContent>
            </Card>
        </div>
    );
}
