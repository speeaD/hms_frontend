const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";

const emptyRoom: Rooms = {
    _id: 0,
    roomNumber: 0,
    type: "",
    price: 0,
    status: "unknown",
    amenities: [],
    capacity: 0,
};

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
    if (!process.env.BACKEND_URL) {
        return fallback;
    }

    try {
        const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return (await response.json()) as T;
    } catch (error) {
        console.warn(`Unable to reach backend for ${path}:`, error);
        return fallback;
    }
}

export const getReservations = async (): Promise<Reservations[]> => {
    return fetchJson<Reservations[]>('/v1/reservation', []);
};

export const getRoomId = async (id: string): Promise<Rooms> => {
    const room = await fetchJson<Rooms | null>(`/v1/room/${id}`, null);
    return room ?? emptyRoom;
};

export const getRooms = async (): Promise<Rooms[]> => {
    return fetchJson<Rooms[]>('/v1/room/', []);
};

export const getStaff = async (): Promise<Staff[]> => {
    return fetchJson<Staff[]>('/v1/staff/', []);
};