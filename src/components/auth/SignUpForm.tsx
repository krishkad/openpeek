"use client";

import { cn } from "@/lib/utils";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: signUpData.email,
          password: signUpData.password,
        }),
      });

      const res = await response.json();

      if (!res.success) {
        console.log(res.message);
        return;
      }

      console.log("SUCCESSFULLY LOGED IN: ", res.data);
      setSignUpData({ email: "", password: "" });

      //   Promise.resolve().then(() => {
      //     localStorage.setItem("freeposal-user", JSON.stringify(res.data));
      //   });
      Promise.resolve().then(() => {
        router.refresh();
      });
    } catch (error) {
      console.log("[ERROR WILE SIGN UP]: ", error);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Create account to access</CardDescription>
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
                    value={signUpData.email}
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
                    value={signUpData.password}
                    onChange={handleOnChange}
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12">
                  Sign Up
                </Button>
              </div>
              <div className="text-center text-sm">
                {/* Don&apos;t have an account?{" "} */}
                Already have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
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
