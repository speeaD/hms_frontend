import { getStaff, getStaffShifts } from "@/lib/data";
import StaffClient from "../../components/StaffClient";

export const dynamic = "force-dynamic";

export default async function Staff() {
  const [staff, shifts] = await Promise.all([
    getStaff(),
    getStaffShifts(),
  ]);

  return <StaffClient staff={staff} shifts={shifts} />;
}