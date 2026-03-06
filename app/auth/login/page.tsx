"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { signInWithEmailAndPassword, signInWithGoogle } from "@/lib/auth";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

function page() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(
        formData.email,
        formData.password,
      );

      if (result instanceof AuthError) {
        setErrorMessage(result.message);
        return;
      }

      router.push("/");
    } catch (error) {
      setErrorMessage("There was an error signing in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-svh">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
        <Card className="grid grid-cols-1 sm:grid-cols-2 gap-0 p-0 overflow-hidden w-full">
          <div className="flex flex-col justify-center px-4 py-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your EventCentral account
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
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Sign in"}
              </Button>
            </form>
            <Separator />
            <Button variant="outline" className="w-full" disabled={loading} onClick={signInWithGoogle}>
              {loading ? <Loader2 className="animate-spin" /> : "Continue with Google"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary underline">
                Sign up
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
        </motion.div>
      </div>
    </div>
  );
}

export default page;
