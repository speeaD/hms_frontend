import GuestsClient from "@/components/GuestClient"
import { getGuests } from "@/lib/guests-data"

export default async function Guests() {
  const guests = await getGuests()

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <header className="px-8 py-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guests</h1>
          <p className="text-gray-600">View and manage all registered guests.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
          + Add Guest
        </button>
      </header>

      <main className="px-6 pb-8">
        <GuestsClient guests={guests} />
      </main>
    </div>
  )
}