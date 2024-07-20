"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { signUpSchema, Inputs } from "../lib/types";
import Link from "next/link";

export default function ZodForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ resolver: zodResolver(signUpSchema) });

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.errors) {
      if (result.errors.name) {
        setError("name", { type: "server", message: result.errors.name });
      } else if (result.errors.email) {
        setError("email", { type: "server", message: result.errors.email });
      } else if (result.errors.password) {
        setError("password", {
          type: "server",
          message: result.errors.password,
        });
      } else if (result.errors.confirmPassword) {
        setError("confirmPassword", {
          type: "server",
          message: result.errors.confirmPassword,
        });
      }
    } else {
      alert("Sign Up Successful");
      formRef.current?.reset();
      window.location.href = "/login";
    }
  };

  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white px-8 py-6 shadow-lg rounded-lg w-full max-w-md flex flex-col"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h1>

        <div className="mb-4">
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 rounded p-3 text-gray-700 focus:outline-none focus:border-teal-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded p-3 text-gray-700 focus:outline-none focus:border-teal-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            {...register("password")}
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

        <div className="mb-6">
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded p-3 text-gray-700 focus:outline-none focus:border-teal-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
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
          Sign Up
        </button>

        <Link
          href="/login"
          className="text-center text-teal-500 hover:text-teal-600 transition"
        >
          Already have an account? Login
        </Link>
      </form>
    </main>
  );
}
