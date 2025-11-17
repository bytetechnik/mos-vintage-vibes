"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      setAdminUser(JSON.parse(user));
    } catch {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);


  if (!adminUser) return null;

  return (
    <div>

      {children}

    </div>
  );
}
