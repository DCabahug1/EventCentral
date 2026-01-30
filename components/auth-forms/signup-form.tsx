"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { continueWithGoogle, signUpWithEmailAndPassword } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setLoading(true);

    // Reset messages
    setMessage("");
    setErrorMessage("");

    // Validate form
    if (!formState.email || !formState.password || !formState.confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (formState.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Sign Up
    const { user, error } = await signUpWithEmailAndPassword(
      formState.email,
      formState.password
    );

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (user) {
      setMessage("Account created successfully.");
      router.push("/");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={formState.password}
                      onChange={(e) =>
                        setFormState({ ...formState, password: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={formState.confirmPassword}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading} >{loading ? 'Creating Account...' : 'Create Account'}</Button>
              </Field>
              {message && <p>{message}</p>}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or
              </FieldSeparator>
              <Button variant="outline" type="button" onClick={continueWithGoogle}>Sign up with Google</Button>
              <FieldDescription className="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/Login/LoginImage.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
