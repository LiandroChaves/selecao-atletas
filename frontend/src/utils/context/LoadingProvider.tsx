"use client";
import { createContext, useContext, useState } from "react";

type LoadingContextType = {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setIsLoading: () => { },
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}
