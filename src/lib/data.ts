import { ROOMS_PATH } from "./config";

// Helper function to get JWT token from sessionStorage (since it's httpOnly cookie)
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem("auth-token");
  }
  return null
}

const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";

const emptyRoom: Rooms = {
    id: "",
    roomNumber: 0,
    type: "",
    price: 0,
    status: "available",
    amenities: [],
    capacity: 0,
};

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
    if (!process.env.BACKEND_URL) {
        return fallback;
    }

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      // Add Authorization header if token exists
      const token = getAuthToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
      console.log(`Fetching ${path} from backend with headers:`, headers);

      const response = await fetch(`${baseUrl}${path}`, {
        method: 'GET',
        headers: headers,
        cache: "no-store"
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
    return fetchJson<Reservations[]>('/v1/reservation', []);
};

export const getRoomId = async (id: string): Promise<Rooms> => {
    const room = await fetchJson<Rooms | null>(`/v1/room/${id}`, null);
    return room ?? emptyRoom;
};

export const getRooms = async (): Promise<Rooms[]> => {
    return fetchJson<Rooms[]>('/v1/room/', []);
};

export async function getAvailableRooms(): Promise<Rooms[]> {
  const rooms = await fetchJson<Rooms[]>(ROOMS_PATH, []);
  return rooms.filter((room) => !room.status || room.status === "available");
}

export const getStaff = async (): Promise<Staff[]> => {
    return fetchJson<Staff[]>('/v1/staff/', []);
};

// New functions for room creation and bulk upload
export const createRoom = async (roomData: Omit<Rooms, 'id'>): Promise<Rooms | null> => {
    if (!process.env.BACKEND_URL) {
        // Mock response for development
        return {
            id: `room_${Date.now()}`,
            ...roomData,
        };
    }

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json"
      }

      // Add Authorization header if token exists
      const token = getAuthToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

        const response = await fetch(`${baseUrl}/v1/room/`, {
            method: 'POST',
            headers: headers,
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
    if (!process.env.BACKEND_URL) {
        // Mock response for development
        // Simulate parsing CSV and creating rooms
        return { success: 5, total: 5 };
    }

    try {
        const response = await fetch(`${baseUrl}/v1/room/bulk`, {
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
    if (!process.env.BACKEND_URL) {
        // Mock data for development
        const today = new Date();
        return [
            {
                id: 'shift_1',
                staffId: 'staff_1',
                date: today.toISOString(),
                startTime: '08:00',
                endTime: '16:00',
            },
            {
                id: 'shift_2',
                staffId: 'staff_2',
                date: today.toISOString(),
                startTime: '16:00',
                endTime: '00:00',
            },
            {
                id: 'shift_3',
                staffId: 'staff_3',
                date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
                startTime: '00:00',
                endTime: '08:00',
            },
        ];
    }

    try {
      const headers: HeadersInit = {}

      // Add Authorization header if token exists
      const token = getAuthToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

        const response = await fetch(`${baseUrl}/v1/staff/shifts`, {
          method: 'GET',
          headers: headers,
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