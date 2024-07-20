"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { signUpSchema, Inputs } from "../lib/types";

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
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });

    if (!response.ok) {
      alert("Something went wrong, Please try again.");
    } else {
      window.location.href = "/login";
    }

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
      } else {
        alert("Something went worng");
      }
    } else {
      alert("Sign Up Successfull");
      formRef.current?.reset();
    }
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-100 px-10 py-4 shadow-md rounded w-1/4 flex flex-col justify-between"
      >
        <h1 className="text-3xl font-bold text-gray-700">Sign Up</h1>

        <div className="mt-6">
          {/* Name Field */}
          <div className="pb-4">
            <input
              {...register("name")}
              type="text"
              name="name"
              placeholder="Name"
              className="mt-1 w-full rounded text-sm p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="pb-4">
            <input
              {...register("email")}
              type="email"
              name="email"
              placeholder="Email"
              className="mt-1 w-full rounded  text-sm p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}

          <div className="pb-4">
            <input
              {...register("password")}
              type="password"
              name="password"
              placeholder="Password"
              className="block mt-1 w-full rounded  text-sm p-2"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}

          <div className="pb-4">
            <input
              {...register("confirmPassword")}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="mt-1 w-full rounded text-sm p-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}

            {/* Submit Button */}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 w-full bg-teal-500 text-white p-2 rounded ${
                isSubmitting ? "opacity-50 cursor-none" : "opacity-100"
              } `}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
