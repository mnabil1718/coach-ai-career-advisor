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
import { Controller, useForm } from "react-hook-form";
import { LoginFormType } from "@/types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/schema/auth.schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

import { Button } from "../ui/button";
import { Required } from "../form/required-span";
import { login } from "@/services/auth/login.service";
import { toastError } from "@/utils/toast";
import { PasswordField } from "../form/password-field";
import { Brand } from "../brand";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormType) => {
    const email = data.email;
    const password = form.getValues("password");

    const { error } = await login({ email, password });
    if (error) {
      toastError(error);
    }

    router.push("/dashboard");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <Brand className="text-center mb-3" />
          <CardTitle className="text-2xl">Log into Your Account</CardTitle>
          <CardDescription>
            Enter your email & password to log in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={form.handleSubmit(handleLogin)}
            className="mb-6"
          >
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
              <PasswordField name="password" control={form.control} />
            </FieldGroup>
            <Field orientation="horizontal" className="mt-4">
              <Button type="submit" form="login-form" className="w-full">
                Login
              </Button>
            </Field>
          </form>
          <Or />
          <GoogleSignInForm />
          <BackLink>
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </BackLink>
        </CardContent>
      </Card>
    </div>
  );
}
