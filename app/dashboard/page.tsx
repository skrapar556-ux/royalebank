import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.isAdmin) {
    redirect("/admin")
  }

  return <DashboardClient session={session} />
}
