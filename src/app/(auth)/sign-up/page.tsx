import { SignUpForm } from "@/components/auth/SignUpForm";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="w-full">
      <div className="max-w-[450px] mx-auto">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
