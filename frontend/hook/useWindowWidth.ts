import { useState, useEffect } from 'react';

export default function useWindowWidth() {
    const [width, setWidth] = useState<number>(
        typeof window !== 'undefined' ? window.innerWidth : 0
    );

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function windowSize() {
        if (width < 640) {
          return "xs"
        }
        else if (width >= 640 && width < 768) {
            return "sm"
        } else if (width >= 768 && width < 1024) {
            return "md"
        } else if (width >= 1024 && width < 1280) {
            return "lg"
        } else if (width >= 1280 && width < 1536) {
            return "xl"
        } else if (width >= 1536) {
            return "2xl"
        }
    }

    return windowSize();
}
