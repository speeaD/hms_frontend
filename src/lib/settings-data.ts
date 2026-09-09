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
  // Mock data for settings (users removed as auth is now handled via backend API)
  return {
    systemSettings: [
      {
        id: "1",
        category: "general",
        key: "hotel_name",
        value: "Royal Kakars Hotel",
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
    users: [], // Empty array as users are now fetched from backend API
  };
};