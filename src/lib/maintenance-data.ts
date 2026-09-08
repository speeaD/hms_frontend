export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  roomId: string;
  roomNumber: number;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  assignedTo: string;
  createdAt: Date;
  scheduledFor: Date;
  completedAt?: Date;
}

export const getMaintenanceData = async (): Promise<MaintenanceTask[]> => {
  // Mock data for maintenance tasks
  return [
    {
      id: "1",
      title: "Fix leaking faucet in room 101",
      description: "The bathroom faucet is dripping and needs to be repaired",
      roomId: "room_101",
      roomNumber: 101,
      priority: "medium",
      status: "pending",
      assignedTo: "John Doe",
      createdAt: new Date("2026-09-01"),
      scheduledFor: new Date("2026-09-08"),
    },
    {
      id: "2",
      title: "Replace HVAC filter in room 205",
      description: "Quarterly maintenance - replace air filter",
      roomId: "room_205",
      roomNumber: 205,
      priority: "low",
      status: "completed",
      assignedTo: "Jane Smith",
      createdAt: new Date("2026-08-25"),
      scheduledFor: new Date("2026-08-28"),
      completedAt: new Date("2026-08-28"),
    },
    {
      id: "3",
      title: "Deep clean suite 301",
      description: "Thorough cleaning after guest departure",
      roomId: "room_301",
      roomNumber: 301,
      priority: "high",
      status: "in-progress",
      assignedTo: "Housekeeping Team",
      createdAt: new Date("2026-09-06"),
      scheduledFor: new Date("2026-09-07"),
    },
  ];
};
