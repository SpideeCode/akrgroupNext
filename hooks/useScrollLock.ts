import { useEffect } from 'react';

export function useScrollLock(isOpen: boolean) {
    useEffect(() => {
        if (isOpen) {
            // Prevent scrolling on the body
            document.body.style.overflow = 'hidden';
            // Optional: Prevent iOS overscroll bounce
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            // document.body.style.top = `-${window.scrollY}px`; // This causes jump on desktop sometimes, careful.
            // Simplified for now, or use the original logic if it was robust.
            // Original logic:
            document.body.style.top = `-${window.scrollY}px`;
        } else {
            // Restore scrolling
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';

            // Restore scroll position
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            // Cleanup on unmount
            if (isOpen) {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.top = '';
                const scrollY = document.body.style.top;
                if (scrollY) {
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }
            }
        };
    }, [isOpen]);
}
