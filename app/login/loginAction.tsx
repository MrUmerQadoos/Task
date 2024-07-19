// "use server";

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function loginAction(
//   currentState: any,
//   formData: FormData
// ): Promise<string> {
//   const email = formData.get("email");
//   const password = formData.get("password");

//   const res = await fetch(`${process.env.ROOT_URL}/api/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   const json = await res.json();

//   if (res.ok) {
//     cookies().set("Authorization", json.token, {
//       secure: true,
//       httpOnly: true,
//       expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3), // 3 days
//       path: "/",
//       sameSite: "strict",
//     });
//     redirect("/"); // Redirect to a protected page
//   } else {
//     return json.error;
//   }
// }
