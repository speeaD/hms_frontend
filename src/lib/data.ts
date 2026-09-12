const apiBaseUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/data`
        : process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}/api/data`
                : "http://localhost:3000/api/data";

const emptyRoom: Rooms = {
    id: "",
    roomNumber: 0,
    type: "",
    price: 0,
    status: "available",
    amenities: [],
    capacity: 0,
};


async function getServerCookieHeader(): Promise<string | undefined> {
    if (typeof window !== "undefined") {
        return undefined;
    }

    const { headers } = await import("next/headers");
    return (await headers()).get("cookie") ?? undefined;
}
async function fetchJson<T>(path: string, fallback: T): Promise<T> {
    try {
        const requestUrl = typeof window === "undefined"
            ? `${apiBaseUrl}${path}`
            : `/api/data${path}`;
        const cookie = await getServerCookieHeader();
        const response = await fetch(requestUrl, {
            method: "GET",
            headers: cookie ? { cookie } : undefined,
            cache: "no-store",
        });

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
    return fetchJson<Reservations[]>('/reservations', []);
};

export const getRoomId = async (id: string): Promise<Rooms> => {
    const room = await fetchJson<Rooms | null>(
        `/rooms/${encodeURIComponent(id)}`,
        null,
    );
    return room ?? emptyRoom;
};

export const getRooms = async (): Promise<Rooms[]> => {
    return fetchJson<Rooms[]>('/rooms', []);
};

export async function getAvailableRooms(): Promise<Rooms[]> {
    const rooms = await fetchJson<Rooms[]>('/rooms', []);
  return rooms.filter((room) => !room.status || room.status === "available");
}

export const getStaff = async (): Promise<Staff[]> => {
    return fetchJson<Staff[]>('/staff', []);
};

// New functions for room creation and bulk upload
export const createRoom = async (roomData: Omit<Rooms, 'id'>): Promise<Rooms | null> => {
    try {
                const response = await fetch('/api/data/rooms', {
            method: 'POST',
                        headers: { "Content-Type": "application/json" },
            body: JSON.stringify(roomData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create room: ${response.status}`);
        }

        return (await response.json()) as Rooms;
    } catch (error) {
        console.error('Error creating room:', error);
        return null;
    }
};

export const bulkUploadRooms = async (formData: FormData): Promise<{ success: number; total: number }> => {
    try {
        const response = await fetch('/api/data/rooms/bulk', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to bulk upload rooms: ${response.status}`);
        }

        return (await response.json()) as { success: number; total: number };
    } catch (error) {
        console.error('Error bulk uploading rooms:', error);
        return { success: 0, total: 0 };
    }
};

// New function for staff shifts
export const getStaffShifts = async () => {
    try {
        const requestUrl = typeof window === 'undefined'
            ? `${apiBaseUrl}/staff/shifts`
            : '/api/data/staff/shifts';
                const cookie = await getServerCookieHeader();
        const response = await fetch(requestUrl, {
          method: 'GET',
                    headers: cookie ? { cookie } : undefined,
          cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch staff shifts: ${response.status}`);
        }
        return (await response.json()) as StaffShift[];
    } catch (error) {
        console.error('Error fetching staff shifts:', error);
        return [];
    }
};