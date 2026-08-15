export {}
declare global {
    interface Reservations {
        _id: number
        firstName: string
        lastName: string
        email: string
        phone: number
        roomId: string
        checkInDate: Date
        checkOutDate: Date
        status: string
    }

    interface Rooms {
        _id: number
        roomNumber: number
        type: string
        price: number
        status: string
        amenities: string[]
        capacity: number
    }

    interface Staff {
        _id: number
        firstName: string
        lastName: string
        role: string
        phone: string
        email: string
        shifts: unknown[]
        status: string
    }
}