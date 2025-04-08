import { redirect } from "next/navigation";
import { getPermissionReports } from "./_data-access/get-permission-reports"
import getSession from "@/lib/getSession"

export default async function Reports() {
  const session = await getSession();

  if (!session) {
    redirect("/")
  }

  const user = await getPermissionReports({ userId: session?.user?.id! });

  if (!user) {
    return (
      <main>
        <h1>Voceê não tem, permissão para acessar essa pagina</h1>
        <p>Assine o plano profissional para ter acesso!</p>
      </main>
    )
  }

  return (
    <main>
      pagina de relatorios
    </main>
  )
}