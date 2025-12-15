'use client';
import ResetPassForm from '@/components/auth/ResetPassForm';
import BackToLoginButton from '@/components/BackToLogin';
import { useToast } from '@/hooks/use-toast';
import { useForgotPasswordMutation } from '@/redux/api/authApi';
import { ResetFormData } from '@/types/forgot-pass';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [forgotPassword] = useForgotPasswordMutation();
  const onSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true);
    const res = await forgotPassword(data.email).unwrap();
    console.log(res);
    setTimeout(() => router.push(`/password/reset?email=${data?.email}`), 1200);
    setIsSubmitting(false);

    toast({
      title: 'Success',
      description: 'If the email is registered, a reset link has been sent.',
      variant: 'success',
    });
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="w-full max-w-md">
        <BackToLoginButton />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
          <p className="text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <ResetPassForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;