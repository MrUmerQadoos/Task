"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRef } from "react";

interface Inputs {
  email: string;
  password: string;
}

export default function LoginPage() {
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
      window.location.href = "/";
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
    <main className="flex h-screen items-center justify-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-100 px-10 py-4 shadow-md rounded w-1/4 flex flex-col justify-between"
      >
        <h1 className="text-3xl font-bold text-gray-700">Login</h1>

        <div className="mt-6">
          <div className="pb-4">
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email"
              className="mt-1 w-full rounded text-sm p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="pb-4">
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Password"
              className="block mt-1 w-full rounded text-sm p-2"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 w-full bg-teal-500 text-white p-2 rounded ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
          >
            Login
          </button>
        </div>
      </form>
    </main>
  );
}
