"use client";

import { useLoading } from "../context/LoadingProvider";
import LoadingScreen from "./LoadingScreen";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isLoading } = useLoading();

    return (
        <>
            {isLoading && <LoadingScreen />}
            {children}
        </>
    );
}
