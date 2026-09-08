export interface SystemSettings {
  id: string;
  category: string;
  key: string;
  value: string | number | boolean;
  description: string;
  updatedAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "staff" | "manager";
  status: "active" | "inactive";
  lastLogin: Date;
}

export const getSettingsData = async (): Promise<{
  systemSettings: SystemSettings[];
  users: User[];
}> => {
  // Mock data for settings
  return {
    systemSettings: [
      {
        id: "1",
        category: "general",
        key: "hotel_name",
        value: "Grand Horizon Hotel",
        description: "Name of the hotel property",
        updatedAt: new Date("2026-09-01"),
      },
      {
        id: "2",
        category: "general",
        key: "check_in_time",
        value: "15:00",
        description: "Standard check-in time",
        updatedAt: new Date("2026-09-01"),
      },
      {
        id: "3",
        category: "general",
        key: "check_out_time",
        value: "11:00",
        description: "Standard check-out time",
        updatedAt: new Date("2026-09-01"),
      },
      {
        id: "4",
        category: "notifications",
        key: "email_enabled",
        value: true,
        description: "Enable email notifications",
        updatedAt: new Date("2026-09-05"),
      },
    ],
    users: [
      {
        id: "1",
        firstName: "Nmesoma",
        lastName: "Administrator",
        email: "admin@hotelier.com",
        role: "admin",
        status: "active",
        lastLogin: new Date("2026-09-07"),
      },
      {
        id: "2",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@hotelier.com",
        role: "manager",
        status: "active",
        lastLogin: new Date("2026-09-06"),
      },
      {
        id: "3",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@hotelier.com",
        role: "staff",
        status: "active",
        lastLogin: new Date("2026-09-05"),
      },
    ],
  };
};
