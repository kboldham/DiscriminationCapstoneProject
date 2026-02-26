"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

function SignUpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setError("Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
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

    // Redirect to welcome page for smooth transition
    router.push("/auth/welcome");
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <div className="border border-teal-200 rounded-2xl shadow-sm p-8 bg-white">
      <p className="text-sm font-semibold text-teal-700 mb-2">Get Started</p>
      <h1 className="text-2xl font-semibold mb-2 text-slate-900">Create Account</h1>
      <p className="text-sm text-slate-600 mb-6">Create an account to save drafts and track your report updates.</p>
      <p className="text-sm text-slate-600 mb-4">Use at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.</p>

      {error && <p className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded p-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="border border-slate-300 bg-white text-slate-900 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border border-slate-300 bg-white text-slate-900 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border border-slate-300 bg-white text-slate-900 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$"
          title="Use at least 8 characters with 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
          minLength={8}
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="border border-slate-300 bg-white text-slate-900 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          minLength={8}
          required
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
            className="w-4 h-4"
          />
          Show password fields
        </label>
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-md p-3 hover:bg-indigo-700 transition disabled:opacity-60 font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-5">
        Already have an account?{" "}
        <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-indigo-700 font-medium hover:underline">
          Sign In
        </Link>
      </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto mt-10 border border-teal-200 rounded-2xl shadow-sm p-8 bg-white text-slate-600">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
