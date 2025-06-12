// utils/hooks/useDisableOnSubmit.ts
import { useState } from "react";

export function useDisableOnSubmit() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitWrapper = async (fn: () => Promise<void>) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await fn();
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, handleSubmitWrapper };
}
