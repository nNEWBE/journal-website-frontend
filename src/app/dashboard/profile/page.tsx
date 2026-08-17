"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchCurrentUser, setUser } from "@/redux/features/auth/authSlice";
import { getSession, type User } from "@/lib/auth";
import { ProfilePanel } from "@/components/dashboard/profile-panel";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [currentUser, setCurrentUser] = useState<User | null>(reduxUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (reduxUser) {
      setCurrentUser(reduxUser);
    } else {
      const session = getSession();
      if (session) {
        setCurrentUser(session);
        dispatch(setUser(session));
      } else {
        dispatch(fetchCurrentUser()).then((res: any) => {
          if (res?.payload && typeof res.payload === "object") {
            setCurrentUser(res.payload as User);
          }
        });
      }
    }
  }, [reduxUser, dispatch]);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <ProfilePanel user={currentUser} />;
}

