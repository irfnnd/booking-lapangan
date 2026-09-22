// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// import { auth } from "@/lib/auth";

// export async function requireLogin() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     redirect("/login");
//   }

//   return session;
// }

// export async function requireAdmin() {
//   const session = await requireLogin();

//   if (session.user.role !== "ADMIN") {
//     redirect("/lapangan");
//   }

//   return session;
// }

// export async function requireUser() {
//   const session = await requireLogin();

//   if (session.user.role !== "USER") {
//     redirect("/admin");
//   }

//   return session;
// }
