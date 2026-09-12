export {};
declare global {
  interface Reservations {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    roomId: string;
    checkInDate: Date;
    checkOutDate: Date;
    status: ReservationStatus;
    room?: Rooms;
    paymentStatus: PaymentStatus;
    numberOfGuests: number;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    status: ReservationStatus;
  }

  interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    lastLogin: string; // ISO string
  }

  interface StaffShift {
    id: string;
    staffId: string;
    date: string; // ISO string
    startTime: string; // HH:MM
    endTime: string; // HH:MM
  }

  interface Rooms {
    id: string;
    roomNumber: string;
    type: string;
    price: number;
    status: RoomStatus;
    amenities: string[];
    capacity: number;
    bedType?: BedType;
  }

  export type ReservationStatus =
    | "pending"
    | "confirmed"
    | "checked_in"
    | "checked_out"
    | "cancelled";

  export type PaymentStatus = "pending" | "paid" | "refunded";

  export type RoomType = "single" | "double" | "suite" | "deluxe";

  export type BedType = "single" | "double" | "queen" | "king";

  export type RoomStatus =
    | "available"
    | "occupied"
    | "maintenance"
    | "reserved";
}
