"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  name: string;
  handle: string;
  avatarId: string;
};

export type ActivityLogEntry = {
  user: User;
  action: string;
  feature: string;
  timestamp: string;
  details: string;
};

type ActivityLogContextType = {
  activityLog: ActivityLogEntry[];
  addActivity: (newActivity: Omit<ActivityLogEntry, 'user' | 'timestamp'>) => void;
};

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

export const ActivityLogProvider = ({ children }: { children: ReactNode }) => {
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  
  // This is a mock user. In a real app, you'd get this from your auth context.
  const currentUser: User = {
    name: 'Ike Zahuemma',
    handle: '@heisninja',
    avatarId: 'avatar1',
  };

  const addActivity = (newActivity: Omit<ActivityLogEntry, 'user' | 'timestamp'>) => {
    const activity: ActivityLogEntry = {
      ...newActivity,
      user: currentUser,
      timestamp: new Date().toISOString(),
    };
    setActivityLog(prevLog => [activity, ...prevLog]);
  };

  return (
    <ActivityLogContext.Provider value={{ activityLog, addActivity }}>
      {children}
    </ActivityLogContext.Provider>
  );
};

export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (context === undefined) {
    throw new Error('useActivityLog must be used within an ActivityLogProvider');
  }
  return context;
};
