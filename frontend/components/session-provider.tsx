"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { SessionExpiredModal } from "./session-expired-modal";
import { getToken, removeToken, removeStoredUser } from "@/lib/api";

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isExpired, setIsExpired] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkSession = () => {
            const token = getToken();

            if (!token) {
                setIsExpired(true);
                setIsChecking(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // If exp is undefined or past current time, it's expired
                if (!decoded.exp || decoded.exp < currentTime) {
                    setIsExpired(true);
                } else {
                    // Valid token, ensure modal is closed
                    setIsExpired(false);
                }
            } catch (error) {
                // Invalid token format
                setIsExpired(true);
            }

            setIsChecking(false);
        };

        // Check immediately on mount and periodically
        checkSession();

        // Check every minute just in case user leaves tab open
        const interval = setInterval(checkSession, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        removeToken();
        removeStoredUser();
        router.push("/login"); // Assuming your login page is at /login
    };

    // Prevent flash of protected content while checking initially
    if (isChecking) {
        return <div className="flex h-screen w-full items-center justify-center p-4">Carregando...</div>; // Could be a nicer skeleton/spinner
    }

    return (
        <>
            <SessionExpiredModal isOpen={isExpired} onConfirm={handleLogout} />
            {/* If expired, we still render children but modal covers it (blocking interaction). 
          Or we could return null. Returning children prevents layout shifts before redirect. */}
            <div className={isExpired ? "pointer-events-none select-none blur-sm" : ""}>
                {children}
            </div>
        </>
    );
}
