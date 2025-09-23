'use client';
import ResetPassForm from '@/components/auth/ResetPassForm';
import SendMailSuccessPage from '@/components/auth/SendMailSuccessPage';
import { useToast } from '@/hooks/use-toast';
import { useForgotPasswordMutation } from '@/redux/api/authApi';
import { ResetFormData } from '@/types/forgot-pass';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [forgotPassword] = useForgotPasswordMutation();
  const onSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true);
    const res = await forgotPassword(data.email).unwrap();
    console.log(res);
    handleFormSuccess(data.email);



    setIsSubmitting(false);

    toast({
      title: 'Success',
      description: 'If the email is registered, a reset link has been sent.',
      variant: 'success',
    });
  };

  const handleFormSuccess = (email: string) => {
    setSubmittedEmail(email);
    setIsSubmitted(true);
  };


  const BackToLoginButton = () => (
    <div className="text-center mb-8">
      <Link
        href="/login"
        className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </Link>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
        <div className="w-full max-w-md">
          <BackToLoginButton />
          <SendMailSuccessPage
            email={submittedEmail}
          />
        </div>
      </div>
    );
  }

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