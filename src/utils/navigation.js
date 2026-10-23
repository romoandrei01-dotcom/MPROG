
import { router } from "expo-router";
import { getSession } from "./auth";

export async function goToDashboard() {
  try {
    const session = await getSession();

    if (session?.role === "admin") {
      router.replace("/admin");
    } else if (session?.role === "staff") {
      router.replace("/staff");
    } else {
      router.replace("/login");
    }
  } catch {
    router.replace("/login");
  }
}
