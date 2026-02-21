"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";

function SignUpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const signupResponse = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const signupData = await signupResponse.json();

    if (!signupResponse.ok) {
      setIsLoading(false);
      setError(signupData.error || "Unable to create account.");
      return;
    }

    const signinResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (!signinResult || signinResult.error) {
      setError("Account created, but sign-in failed. Please sign in manually.");
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    router.push(signinResult.url || callbackUrl);
  };

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-xl shadow-lg p-8 bg-white">
      <h1 className="text-2xl font-semibold mb-2">Create Account</h1>
      <p className="text-sm text-gray-700 mb-6">Create an account to save drafts and track your report updates.</p>

      {error && <p className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded p-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name (optional)"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          minLength={8}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          minLength={8}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-gray-700 mt-5">
        Already have an account?{" "}
        <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-blue-700 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto mt-10 border rounded-xl shadow-lg p-8 bg-white">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
