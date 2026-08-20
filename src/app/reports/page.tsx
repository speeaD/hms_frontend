import ReportsClient from "@/components/ReportsClient"
import { getReportsData } from "@/lib/reports-data"

export default async function Reports() {
  const data = await getReportsData()

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <main className="p-8">
        <ReportsClient data={data} />
      </main>
    </div>
  )
}