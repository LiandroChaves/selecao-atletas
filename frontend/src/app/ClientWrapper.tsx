"use client";

import { ReactNode } from "react";
import { useLoading } from "../utils/context/LoadingProvider";
import LoadingScreen from "../utils/utilities/LoadingScreen";

export default function ClientWrapper({ children }: { children: ReactNode }) {
    const { isLoading } = useLoading();

    return (
        <>
            {isLoading && <LoadingScreen />}
            {children}
        </>
    );
}
