import { signUpSchema } from "@/app/lib/types";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();

  const result = signUpSchema.safeParse(data);
  let zodErrors = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    return NextResponse.json({
      success: false,
      errors: zodErrors,
    });
  }

  const parsedData = result.data;

  const hashedPassword = await bcrypt.hash(parsedData.password, 10);

  try {
    await prisma.user.create({
      data: {
        name: parsedData.name || "Anonymous",
        email: parsedData.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({
        success: false,
        error: "Email already exists",
      });
    }
    // For other errors, consider logging them for debugging
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}
