"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

type User = {
  name: string;
  handle: string;
  avatarId: string;
  email: string | null;
};

export type ActivityLogEntry = {
  id?: string;
  user: User;
  action: string;
  feature: string;
  timestamp: Timestamp;
  details: string;
};

type ActivityLogContextType = {
  activityLog: ActivityLogEntry[];
  addActivity: (newActivity: Omit<ActivityLogEntry, 'user' | 'timestamp'>) => void;
};

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

export const ActivityLogProvider = ({ children }: { children: ReactNode }) => {
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        // In a real app, you might fetch profile info from Firestore here
        // For now, we'll create a mock profile from the auth user
        const atIndex = user.email?.indexOf('@') ?? -1;
        const handle = atIndex > -1 ? `@${user.email?.substring(0, atIndex)}` : '@user';
        setCurrentUser({
          name: user.displayName || user.email || 'Anonymous',
          handle: handle,
          avatarId: `avatar${(user.email?.length || 1) % 8 + 1}`,
          email: user.email,
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'activityLog'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logs: ActivityLogEntry[] = [];
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() } as ActivityLogEntry);
      });
      setActivityLog(logs);
    });
    return () => unsubscribe();
  }, []);

  const addActivity = async (newActivity: Omit<ActivityLogEntry, 'user' | 'timestamp' | 'id'>) => {
    if (!currentUser) {
      console.error("Cannot add activity: no user is signed in.");
      return;
    }
    const activity = {
      ...newActivity,
      user: currentUser,
      timestamp: Timestamp.now(),
    };
    try {
      await addDoc(collection(db, 'activityLog'), activity);
    } catch (error) {
      console.error("Error writing activity to Firestore: ", error);
    }
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
