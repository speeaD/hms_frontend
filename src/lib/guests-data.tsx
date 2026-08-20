export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  totalStays: number
  lastStay: string // ISO date string
  status: 'Checked In' | 'Checked Out'
}

const FIRST_NAMES = [
  'Olisaemeka', 'John', 'Jane', 'Michael', 'Emily', 'Chidinma', 'David', 'Sarah',
  'Ifeoma', 'James', 'Grace', 'Daniel', 'Ngozi', 'Peter', 'Ruth', 'Samuel',
  'Blessing', 'Tobi', 'Amaka', 'Kunle',
]
const LAST_NAMES = [
  'Ejiofor', 'Doe', 'Smith', 'Brown', 'Johnson', 'Okafor', 'Williams', 'Adeyemi',
  'Nwosu', 'Bello', 'Okonkwo', 'Eze', 'Balogun', 'Chukwu', 'Adebayo', 'Yusuf',
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// TODO: replace with a real DB call, e.g. `return db.guests.findMany(...)`.
// Kept async + same return shape so swapping the implementation is a one-line change.
export async function getGuests(): Promise<Guest[]> {
  const TOTAL = 256
  const guests: Guest[] = []

  for (let i = 0; i < TOTAL; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length]
    const last = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length]
    const name = `${first} ${last}`
    const emailSlug = `${first}${last}`.toLowerCase().replace(/[^a-z]/g, '')
    const phoneMid = 800 + Math.floor(seededRandom(i + 1) * 99)
    const phoneEnd = 1000 + Math.floor(seededRandom(i + 99) * 8999)
    const totalStays = 1 + Math.floor(seededRandom(i + 7) * 8)
    const daysAgo = Math.floor(seededRandom(i + 13) * 60)
    const lastStay = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
    const status: Guest['status'] = i % 6 === 0 ? 'Checked In' : 'Checked Out'

    guests.push({
      id: `guest-${i + 1}`,
      name,
      email: `${emailSlug}@email.com`,
      phone: `+234 ${phoneMid} ${String(phoneEnd).slice(0, 3)} ${String(phoneEnd).slice(3)}`,
      totalStays,
      lastStay,
      status,
    })
  }

  return guests
}