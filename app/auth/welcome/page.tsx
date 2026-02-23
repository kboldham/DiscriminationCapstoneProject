"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic";

function WelcomeContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    
    if (autoRedirect && status === "authenticated") {
      const timer = setTimeout(() => {
        router.push("/report");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status, autoRedirect, router]);

  if (status === "loading") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="border rounded-xl shadow-lg p-8 bg-white text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back!</h1>
        </div>

        <p className="text-gray-700 mb-2">
          You're signed in as <span className="font-semibold">{session.user?.email}</span>
        </p>
        
        <p className="text-sm text-gray-600 mb-6">
          You can now track your reports and receive secure follow-up updates.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              setAutoRedirect(false);
              router.push("/report");
            }}
            className="w-full bg-indigo-600 text-white rounded-md px-4 py-3 hover:bg-indigo-700 transition font-medium"
          >
            Continue to Report →
          </button>
          
          <button
            onClick={() => {
              setAutoRedirect(false);
              router.push("/dashboard");
            }}
            className="w-full border border-indigo-600 text-indigo-600 rounded-md px-4 py-3 hover:bg-indigo-50 transition font-medium"
          >
            View Dashboard
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">Redirecting to report form in a few seconds...</p>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return <WelcomeContent />;
}
