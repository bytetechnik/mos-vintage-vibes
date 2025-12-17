'use client';

import { getBackendURL } from "@/helpers/config/envConfig";
import { toast } from "@/hooks/use-toast";
import { useOAuth2LoginMutation } from "@/redux/api/OAuthApi";
import { storeUserInfo } from "@/services/auth.service";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const OAuth = () => {
  const router = useRouter();
  const [oAuth2Login] = useOAuth2LoginMutation();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  useEffect(() => {
    const handleOAuth = async () => {
      // Get query params from URL
      const params = new URLSearchParams(window.location.search);
      const tokenId = params.get("oAuthTokenId");

      if (!tokenId) return;

      // const res: any = await oAuth2Login({ oAuthUserTokenId: tokenId }).unwrap();

      const res = await axios.post(`${getBackendURL}/oauth2/public/login`, {
        oAuthUserTokenId: tokenId,
      });

      if (res?.data?.statusCode === 200 && res?.data.data) {
        storeUserInfo({ token: res?.data.data.token, userData: JSON.stringify(res?.data.data.user) });
        const destination = decodeURIComponent(redirectUrl);
        router.push(destination);

        toast({
          title: "Login Successful",
          description: "Welcome back to Mo's VintageWorld!",
          variant: "success",
        });

      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });

        router.push('/login')
      }

    };

    handleOAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oAuth2Login, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Authenticating, please wait...</p>
    </div>
  );
};

export default OAuth;
