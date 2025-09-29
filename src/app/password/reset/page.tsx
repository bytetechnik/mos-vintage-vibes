"use client";

import TokenStep from "@/components/auth/ TokenStep";
import PasswordRest from "@/components/auth/PasswordRest";
import BackToLoginButton from "@/components/BackToLogin";
import { useToast } from "@/hooks/use-toast";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { ResetPassFormData, resetPassPageProps } from "@/types/forgot-pass";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const [resetPassword] = useResetPasswordMutation();

  const handleTokenNext = (enteredToken: string) => {
    setToken(enteredToken);
    setStep(2);
  };

  const onSubmit = async (data: ResetPassFormData) => {
    setIsSubmitting(true);

    const payload: resetPassPageProps = {
      ...data,
      token: token,
      email: email || "",
    };

    const res = await resetPassword(payload).unwrap();
    if (res?.success) {
      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
        variant: "success",
      });
      setTimeout(() => router.push("/login"), 1600);
    } else {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="w-full max-w-md">
        <BackToLoginButton />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reset Password
          </h1>
          <p className="text-muted-foreground">
            {step === 1
              ? "Enter the reset token you received via email."
              : "Enter your new password below to reset your account."}
          </p>
        </div>

        {step === 1 ? (
          <TokenStep onNext={handleTokenNext} />
        ) : (
          <PasswordRest onSubmit={onSubmit} isSubmitting={isSubmitting} />
        )}
      </div>
    </div>
  );
}
