"use server";

import { revalidatePath } from "next/cache";
import { requireApiBaseUrl, RESERVATIONS_PATH } from "./config";

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface CreateReservationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomId: string;
  checkInDate: string; // "yyyy-mm-dd" from <input type="date">
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  /** Admin can mark a manually-entered booking (phone/walk-in) as already paid. */
  markAsPaid: boolean;
}

/**
 * Creates a reservation directly, without a payment step. Calls the same
 * endpoint as `reserveRoom` in reservationController.js — intended for
 * admin-entered bookings (phone, walk-in, already settled another way).
 */
export async function createReservation(
  input: CreateReservationInput
): Promise<ActionResult<{ id: string }>> {
  const base = requireApiBaseUrl();

  if (
    !input.firstName ||
    !input.lastName ||
    !input.email ||
    !input.phone ||
    !input.roomId ||
    !input.checkInDate ||
    !input.checkOutDate
  ) {
    return { success: false, error: "Please fill in every field." };
  }

  if (new Date(input.checkOutDate) <= new Date(input.checkInDate)) {
    return { success: false, error: "Check-out date must be after check-in date." };
  }

  const checkInDate = `${input.checkInDate}T00:00:00.000Z`;
  const checkOutDate = `${input.checkOutDate}T00:00:00.000Z`;

  if (!input.totalAmount || input.totalAmount <= 0) {
    return { success: false, error: "Enter a valid total amount." };
  }

  const payload = {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    roomId: input.roomId,
    checkInDate,
    checkOutDate,
    numberOfGuests: input.numberOfGuests,
    totalAmount: input.totalAmount,
    status: input.markAsPaid ? "confirmed" : "pending",
    paymentStatus: input.markAsPaid ? "paid" : "pending",
  };

  let res: Response;
  try {
    res = await fetch(`${base}${RESERVATIONS_PATH}reserve-room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { success: false, error: "Could not reach the reservations service." };
  }
  console.log("Response from createReservation:", res);

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      success: false,
      error: body?.message ?? `Request failed with status ${res.status}.`,
    };
  }

  revalidatePath("/reservations");
  return { success: true, data: { id: body.id } };
}

/**
 * Updates only the reservation's status — matches `updateReservationStatus`
 * in the controller, which also flips the room's status (available /
 * occupied / reserved) accordingly. This is the only mutation the current
 * backend supports beyond create.
 */
export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<ActionResult> {
  const base = requireApiBaseUrl();

  let res: Response;
  try {
    res = await fetch(`${base}${RESERVATIONS_PATH}/update-reservation/${encodeURIComponent(id)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }),
    });
  } catch {
    return { success: false, error: "Could not reach the reservations service." };
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      success: false,
      error: body?.message ?? `Request failed with status ${res.status}.`,
    };
  }

  revalidatePath("/reservations");
  return { success: true, data: undefined };
}
