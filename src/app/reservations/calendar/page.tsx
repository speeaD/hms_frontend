'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getStaffShifts } from '@/lib/data';
import { getReservations } from '@/lib/data';

// Define the StaffShift type since it's not in global.d.ts
interface StaffShift {
  id: string;
  staffId: string;
  date: string; // ISO string
  startTime: string;
  endTime: string;
}

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

// Helper function to format a date to YYYY-MM-DD string for map keys
const formatDateKey = (date: Date): string => {
  return date.toDateString(); // Using toDateString for simplicity, e.g., "Mon Sep 07 2026"
};

// Helper function to get the weeks of a month as a 2D array of dates (or null for padding)
const getWeightsOfMonth = (year: number, month: number): (Date | null)[][] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // last day of the month
  const startingDay = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)

  const daysInMonth = lastDay.getDate();
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  // Add padding days from previous month
  for (let i = 0; i < startingDay; i++) {
    week.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    week.push(currentDate);

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // Add padding days for the last week
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return weeks;
};

export default function ReservationsCalendar() {
  const [staffShifts, setStaffShifts] = useState<StaffShift[]>([]);
  const [reservations, setReservations] = useState<any[]>([]); // We'll use the Reservations type from global
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [shifts, res] = await Promise.all([
          getStaffShifts(),
          getReservations(),
        ]);
        setStaffShifts(shifts);
        setReservations(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data: create maps for quick lookup
  const staffCountMap = useMemo(() => {
    const map = new Map<string, number>();
    staffShifts.forEach((shift) => {
      const shiftDate = new Date(shift.date);
      const key = formatDateKey(shiftDate);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [staffShifts]);

  const futureResCountMap = useMemo(() => {
    const map = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    reservations.forEach((res: any) => {
      const checkInDate = new Date(res.checkInDate);
      // Only count future reservations (check-in date >= today) and status confirmed
      if (res.status === 'confirmed' && checkInDate >= today) {
        const key = formatDateKey(checkInDate);
        map.set(key, (map.get(key) || 0) + 1);
      }
    });
    return map;
  }, [reservations]);

  const currentGuestsCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations.filter((res: any) => {
      const checkIn = new Date(res.checkInDate);
      const checkOut = new Date(res.checkOutDate);
      return checkIn <= today && checkOut >= today;
    }).length;
  }, [reservations]);

  // Get the weeks for the current displayed month
  const weeks = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return getWeightsOfMonth(year, month);
  }, [currentDate]);

  // Format month and year for display
  const monthYearString = useMemo(() => {
    return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }, [currentDate]);

  // Handle month navigation
  const previousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reservation Calendar</h1>
            <p className="text-gray-600">
              View staff shifts, current guests, and future reservations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Month
            </button>
            <span className="font-medium text-gray-700">{monthYearString}</span>
            <button
              onClick={nextMonth}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              Next Month
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Current guests info (for today) */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Current Guests (Today)</p>
              <p className="text-2xl font-bold text-blue-600">{currentGuestsCount}</p>
            </div>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 gap-0">
            {/* Weekday headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div
                key={index}
                className="px-4 py-3 text-xs font-medium text-gray-500 bg-gray-50 border-b"
              >
                {day}
              </div>
            ))}
            {/* Days */}
            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const isToday = day !== null && isSameDay(day, new Date());
                  const isInMonth = day !== null && day.getMonth() === currentDate.getMonth();
                  const key = day ? formatDateKey(day) : '';

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`relative min-h-[80px] border border-gray-200 px-3 py-2 ${
                        isToday
                          ? 'border-blue-300 bg-blue-50'
                          : !isInMonth
                            ? 'bg-gray-50'
                            : 'bg-white'
                      }`}
                    >
                      {day && (
                        <>
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-gray-900">{day.getDate()}</div>
                            {isToday && (
                              <div className="text-xs text-blue-600">Today</div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 space-y-0.5">
                            <div>Staff: {staffCountMap.get(key) || 0}</div>
                            <div>Future: {futureResCountMap.get(key) || 0}</div>
                            {isToday && (
                              <div className="font-medium text-blue-600">
                                Current Guests: {currentGuestsCount}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Legend</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-blue-500 rounded"></div>
              </div>
              <div className="ml-2">Today's date</div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 border border-gray-300"></div>
              </div>
              <div className="ml-2">Other dates</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}