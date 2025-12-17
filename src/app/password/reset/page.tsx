// app/password/reset/page.tsx
import { Suspense } from "react";
import ResetClient from "./ResetClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    }>
      <ResetClient />
    </Suspense>
  );
}
