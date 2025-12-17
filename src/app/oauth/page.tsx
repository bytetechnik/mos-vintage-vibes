// app/oauth/page.tsx
import { Suspense } from "react";
import OAuthClient from "./OAuthClient";

export default function OAuthPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <p>Authenticating, please wait...</p>
      </div>
    }>
      <OAuthClient />
    </Suspense>
  );
}
