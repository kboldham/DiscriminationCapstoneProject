"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(result.url || callbackUrl);
  };

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-xl shadow-lg p-8 bg-white">
      <h1 className="text-2xl font-semibold mb-2">Sign In</h1>
      <p className="text-sm text-gray-700 mb-6">Access your account to track report status and receive updates.</p>

      {error && <p className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded p-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
            className="w-4 h-4"
          />
          Show password
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-gray-700 mt-5">
        Don&apos;t have an account?{" "}
        <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-blue-700 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto mt-10 border rounded-xl shadow-lg p-8 bg-white">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
