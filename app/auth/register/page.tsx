"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { AuthMarketingHero } from "@/components/auth/AuthHero";
import { signUpWithEmailAndPassword, signInWithGoogle } from "@/lib/auth";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

function page() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const result = await signUpWithEmailAndPassword(
        formData.email,
        formData.password,
      );

      if (result instanceof AuthError) {
        setErrorMessage(result.message);
        return;
      }

      router.push("/onboarding");
    } catch {
      setErrorMessage("There was an error creating your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100svh-4rem)] w-full flex-col overflow-x-hidden lg:h-[calc(100svh-4rem)] lg:flex-row lg:overflow-hidden">
      <AuthMarketingHero />
      <motion.div
        className="order-2 flex w-full flex-1 flex-col items-center justify-center gap-6 border-b border-border bg-background px-6 py-10 sm:px-10 lg:order-0 lg:w-1/3 lg:flex-none lg:shrink-0 lg:border-b-0 lg:border-l lg:py-12 lg:px-16"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Join EventCentral to create and manage your events
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center gap-2">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                minLength={8}
                maxLength={20}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <Button
                type="button"
                variant="default"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </Button>
        </form>
        <Separator className="w-full max-w-md" />
        <div className="flex w-full max-w-md flex-col gap-4">
          <Button
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={signInWithGoogle}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Continue with Google"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default page;
