const baseUrl: String = process.env.BACKEND_URL || "http://localhost:3000"

export const getReservations = async () => {
    const data = await fetch(baseUrl + "/v1/reservation")
    const reservations: [Reservations] = await data.json();
    return reservations
}

export const getRoomId = async (id: string) => {
    const data = await fetch(baseUrl+ "/v1/room/"+ id)
    const room: Rooms = await data.json()
    return room
}

export const getRooms = async () => {
    const data = await fetch(baseUrl+ "/v1/room/")
    const rooms: [Rooms] = await data.json()
    return rooms
}

export const getStaff = async () => {
    const data = await fetch(baseUrl+ "/v1/staff/")
    const staff: [Staff] = await data.json()
    return staff
}