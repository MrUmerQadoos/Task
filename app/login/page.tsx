"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface Inputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      document.cookie = `Authorization=${result.token}; path=/; secure; samesite=strict;`;
      router.push("/"); // Use router.push for redirection
    } else {
      if (result.error) {
        setError("password", { type: "server", message: result.error });
      } else {
        alert("Something went wrong. Please try again.");
      }
    }

    formRef.current?.reset();
  };

  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white px-8 py-6 shadow-lg rounded-lg w-full max-w-md flex flex-col"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h1>

        <div className="mb-4">
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded p-3 text-gray-700 focus:outline-none focus:border-teal-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded p-3 text-gray-700 focus:outline-none focus:border-teal-500"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mb-4 w-full bg-teal-500 text-white p-3 rounded hover:bg-teal-600 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "opacity-100"
          }`}
        >
          Login
        </button>

        <Link
          href="/signup"
          className="text-center text-teal-500 hover:text-teal-600 transition"
        >
          Sign Up
        </Link>
      </form>
    </main>
  );
}
