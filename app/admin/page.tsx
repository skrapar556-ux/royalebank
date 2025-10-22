import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AdminClient from "@/components/admin-client"

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (!session.isAdmin) {
    redirect("/dashboard")
  }

  return <AdminClient session={session} />
}
