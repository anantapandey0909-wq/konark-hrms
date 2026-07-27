"use client";

import * as React from "react";
import { useState } from "react";
import { NotificationCenter } from "./notification-center";
import { CompanyCalendar } from "./company-calendar";
import { UpcomingHolidays } from "./upcoming-holidays";
import { CompanyEvents } from "./company-events";
import { BirthdaysAnniversaries } from "./birthdays-anniversaries";
import { AnnouncementBoard } from "./announcement-board";
import { NotificationPreferences } from "./notification-preferences";

// Unified mock data for communications module
const mockCommunicationData = {
  notifications: [
    { id: "n-1", title: "Leave Request Approved", description: "Your leave application for Nov 12-14 has been verified and approved.", category: "PERSONAL" as const, timestamp: "2025-10-27T09:15:00Z", isRead: false },
    { id: "n-2", title: "Monthly Town Hall Scheduled", description: "Join us for our monthly leadership updates this Thursday at 3:00 PM.", category: "SYSTEM" as const, timestamp: "2025-10-26T14:00:00Z", isRead: false },
    { id: "n-3", title: "Payslip Generated", description: "Your payslip for October 2025 is now generated and ready for download.", category: "PERSONAL" as const, timestamp: "2025-10-25T11:30:00Z", isRead: true },
    { id: "n-4", title: "Compliance Sign-off Due", description: "Please complete your quarterly security declarations by Friday.", category: "SYSTEM" as const, timestamp: "2025-10-24T08:00:00Z", isRead: false },
  ],
  holidays: [
    { id: "h-1", name: "Diwali Celebration", date: "2025-11-01", type: "MANDATORY" as const },
    { id: "h-2", name: "Guru Nanak Jayanti", date: "2025-11-05", type: "OPTIONAL" as const },
    { id: "h-3", name: "Christmas Day", date: "2025-12-25", type: "MANDATORY" as const },
  ],
  events: [
    { id: "ev-1", name: "Q3 Strategy Presentation", time: "11:00 AM - 12:30 PM", date: "2025-10-30", location: "Main Conf Room / Zoom" },
    { id: "ev-2", name: "Tech Talk: AI in HR Workflows", time: "04:00 PM - 05:00 PM", date: "2025-11-04", location: "Learning Center / Meet" },
  ],
  celebrations: [
    { id: "c-1", name: "Preeti Singh", type: "BIRTHDAY" as const, date: "2025-10-28", department: "Design Ops" },
    { id: "c-2", name: "Vikram Malhotra", type: "ANNIVERSARY" as const, date: "2025-10-29", department: "Engineering", years: 3 },
    { id: "c-3", name: "Suresh Kumar", type: "BIRTHDAY" as const, date: "2025-11-02", department: "Finance" },
  ],
  announcements: [
    { id: "an-1", title: "New Group Medical Policy 2025-26", summary: "HR has completed the tie-up with Star Health insurance. Policy documents are attached.", content: "All full-time employees are requested to review our updated health insurance coverage. Policy cards and detailed network listings have been deployed under shared employee directories.", author: "HR Benefits Team", publishedAt: "2025-10-25" },
    { id: "an-2", title: "Office Renovation: Wing B Closure", summary: "Wing B will remain closed for infrastructure updates over the upcoming weekend.", content: "Starting Friday 8 PM, Wing B will be sealed off for structural upgrades. Hybrid teams are advised to reserve workspace bookings in Wing A or transition remotely on Friday.", author: "Admin Operations", publishedAt: "2025-10-24" },
  ],
};

export function EmployeeNotifications() {
  const [notifications, setNotifications] = useState(mockCommunicationData.notifications);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Communications & Notifications
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track real-time workspace updates, structural announcements, peer celebrations, and team calendars.
        </p>
      </div>

      {/* Grid Alignment Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Notification list & Preferences */}
        <div className="space-y-6 lg:col-span-1">
          <NotificationCenter
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
          />
          <NotificationPreferences />
        </div>

        {/* Center Column: Company calendars & holiday schedules */}
        <div className="space-y-6 lg:col-span-1">
          <CompanyCalendar
            holidays={mockCommunicationData.holidays}
            events={mockCommunicationData.events}
          />
          <UpcomingHolidays holidays={mockCommunicationData.holidays} />
          <CompanyEvents events={mockCommunicationData.events} />
        </div>

        {/* Right Column: Peer celebrations & complete announcements board */}
        <div className="space-y-6 lg:col-span-1">
          <BirthdaysAnniversaries celebrations={mockCommunicationData.celebrations} />
          <AnnouncementBoard announcements={mockCommunicationData.announcements} />
        </div>
      </div>
    </div>
  );
}