import { getMaintenanceData } from "@/lib/maintenance-data";
import MaintenanceClient from "../../components/MaintenanceClient";

export const dynamic = "force-dynamic";

export default async function Maintenance() {
  const maintenanceData = await getMaintenanceData();

  return <MaintenanceClient maintenanceData={maintenanceData} />;
}