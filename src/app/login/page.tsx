'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { useToast } from '@/hooks/use-toast';
import { useUserLoginMutation, useUserSignupMutation } from '@/redux/api/authApi';
import { LoginFormValues, SignupFormValues } from '@/schemas/login';
import { storeUserInfo } from '@/services/auth.service';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { toast } = useToast();
  const router = useRouter();
  const [userLogin] = useUserLoginMutation();
  const [userSignup] = useUserSignupMutation();

  const handleLogin = async (data: LoginFormValues) => {
    const res = await userLogin(data).unwrap();
    if (res?.token) {
      storeUserInfo({ accessToken: res.token });

      toast({
        title: "Login Successful",
        description: "Welcome back to Mo's VintageWorld!",
        variant: "success",
      });

      const destination = decodeURIComponent(redirectUrl);
      router.push(destination);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }

  };

  const handleSignup = async (data: SignupFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...signupData } = data;
    const res = await userSignup(signupData).unwrap();

    if (res?.token) {
      storeUserInfo({ accessToken: res.token });

      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
        variant: "success",
      });

      const destination = decodeURIComponent(redirectUrl);
      router.push(destination);
    } else {
      toast({
        title: "Signup Failed",
        description: res.message || "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    }

  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-beige to-background p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

        <div className="bg-card rounded-xl shadow-card-custom p-8 border border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6">
              <LoginForm onSubmit={handleLogin} isSubmitting={false} />

              <div className="flex items-center justify-between text-sm">
                <Link href="/password/forgot" className="text-vintage-orange hover:underline">
                  Forgot password?
                </Link>
              </div>

              <SocialAuthButtons mode="login" />
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <SignupForm onSubmit={handleSignup} isSubmitting={false} />
              <SocialAuthButtons mode="signup" />
            </TabsContent>
          </Tabs>
        </div>

        <AuthFooter />
      </div>
    </div>
  );
}