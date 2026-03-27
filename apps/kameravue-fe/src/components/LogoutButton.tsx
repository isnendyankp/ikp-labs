"use client";

import { useRouter } from "next/navigation";
import { logout } from "../lib/auth";
import { useState } from "react";

/**
 * LogoutButton Component
 *
 * Provides logout functionality with:
 * - Clear JWT token from localStorage
 * - Redirect to login page
 * - Loading state during logout process
 *
 * Usage:
 * <LogoutButton />
 */
export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);

    // Clear token from localStorage
    logout();

    // Redirect to login page
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`py-2 px-4 rounded-lg font-medium transition-colors ${
        isLoading
          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
          : "bg-red-600 text-white hover:bg-red-700"
      }`}
    >
      {isLoading ? "Logging Out..." : "Logout"}
    </button>
  );
}
