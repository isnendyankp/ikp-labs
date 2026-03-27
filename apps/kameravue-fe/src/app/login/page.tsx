"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { isAuthenticated } from "@/lib/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/myprofile";

  // Redirect authenticated users to their destination
  useEffect(() => {
    if (isAuthenticated()) {
      // Validate returnUrl is a local path (prevent open redirect attacks)
      if (returnUrl && !returnUrl.startsWith("/")) {
        console.warn("Invalid returnUrl detected, using default");
        router.push("/myprofile");
        return;
      }
      router.push(returnUrl);
    }
  }, [router, returnUrl]);

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
