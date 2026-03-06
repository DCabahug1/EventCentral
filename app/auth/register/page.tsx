"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { signUpWithEmailAndPassword } from "@/lib/auth";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

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
    } catch (error) {
      setErrorMessage("There was an error creating your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-svh">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="grid grid-cols-1 sm:grid-cols-2 gap-0 p-0 overflow-hidden w-full max-w-2xl">
          <div className="flex flex-col justify-center px-4 py-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-sm text-muted-foreground">
                Join EventCentral to create and manage your events
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
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
            <Separator />
            <Button variant="outline" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Continue with Google"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary underline">
                Login
              </Link>
            </p>
          </div>
          <Image
            src="/AuthPages/AuthFormSideImage.jpg"
            alt="EventCentral"
            width={800}
            height={800}
            className="hidden sm:block h-full object-cover"
          />
        </Card>
      </div>
    </div>
  );
}

export default page;
