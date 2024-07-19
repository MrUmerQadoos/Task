// "use server";

// import { redirect } from "next/navigation";
// import { z } from "zod";
// import { signUpSchema } from "@/lib/types";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import { ZodError } from "zod";

// const prisma = new PrismaClient();

// export default async function signupAction(
//   formData: FormData
// ): Promise<string> {
//   try {
//     // Get the data off the form
//     const data = {
//       name: formData.get("name") as string,
//       email: formData.get("email") as string,
//       password: formData.get("password") as string,
//       confirmPassword: formData.get("confirmPassword") as string,
//     };

//     // Validate data
//     const parsedData = signUpSchema.parse(data);

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(parsedData.password, 10);

//     // Create a user in the database
//     const user = await prisma.user.create({
//       data: {
//         name: parsedData.name || "Anonymous",
//         email: parsedData.email,
//         password: hashedPassword,
//       },
//     });

//     // Redirect to login if success
//     redirect("/login");
//   } catch (error: any) {
//     if (error instanceof ZodError) {
//       return JSON.stringify({ errors: error.errors });
//     }

//     if (error.code === "P2002") {
//       return JSON.stringify({ error: "Email already exists" });
//     }

//     return JSON.stringify({ error: "Internal server error" });
//   }

//   return "";
// }
