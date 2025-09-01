"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [signInData, setSignInData] = useState({ email: "", password: "" });

  const router = useRouter();
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: signInData.email,
          password: signInData.password,
        }),
      });

      const res = await response.json();

      if (!res.success) {
        console.log(res.message);
        return;
      }

      console.log("SUCCESSFULLY LOGED IN: ", res.data);
      setSignInData({ email: "", password: "" });

      
      Promise.resolve().then(() => {
        router.push("/");
      });
    } catch (error) {
      console.log("[ERROR WILE SIGN iN]: ", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with E-mail and password account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    onChange={handleOnChange}
                    placeholder="m@example.com"
                    className="h-12"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    onChange={handleOnChange}
                     className="h-12"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12">
                  Sign in
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}