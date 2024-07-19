// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import * as jose from "jose";
// import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function POST(request: Request) {
//   const body = await request.json();
//   const { email, password } = body;

//   // Validate email and password (you can add more robust validation if needed)
//   if (!email || !password) {
//     return NextResponse.json(
//       { error: "Email and password are required" },
//       { status: 400 }
//     );
//   }

//   // Lookup the user
//   const user = await prisma.user.findFirst({ where: { email } });

//   if (!user) {
//     return NextResponse.json(
//       { error: "Invalid email or password" },
//       { status: 400 }
//     );
//   }

//   // Compare password
//   const isCorrectPassword = await bcrypt.compare(password, user.password);

//   if (!isCorrectPassword) {
//     return NextResponse.json(
//       { error: "Invalid email or password" },
//       { status: 400 }
//     );
//   }

//   // Create JWT token
//   const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//   const alg = "HS256";

//   const jwt = await new jose.SignJWT({})
//     .setProtectedHeader({ alg })
//     .setExpirationTime("72h")
//     .setSubject(user.id.toString())
//     .sign(secret);

//   // Respond with the token
//   return NextResponse.json({ token: jwt });
// }

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const alg = "HS256";

  const jwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg })
    .setExpirationTime("72h")
    .setSubject(user.id.toString())
    .sign(secret);

  return NextResponse.json({ token: jwt });
}
