import {delaGothic} from "@/lib/font/font";

export default function Logo({
    className,
    size
}:{
    className?: string;
    size: "sm" | "md" | "lg";
}) {
    return (
        <div className={`${className} ${size === "lg"?"text-4xl":size === "md"? "text-2xl":"text-lg"} flex items-center gap-1 w-fit`}>
            <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className={`${size === "lg"?"size-12":size === "md"? "size-8":"size-4"} mt-2`}
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M15.651 12.851c-2.13 1.94-5.17 2.91-9.07 2.91-.91 0-1.87-.04-2.88-.17-.38.86-.6 1.71-.6 2.51 0 .55-.45 1-1 1s-1-.45-1-1c0-.24.01-.48.04-.72.02-.13.03-.26.06-.39.18-1.13.64-2.27 1.29-3.39 2.32-4.02 9.3-8.68 12.61-9.5-4.76-.03-12 3-13.91 6.93 0-2.89 2.3-6.42 5.46-8.38 4.54-2.82 10.47-1.14 12.06 0 .23.16.37.42.38.7.08 2.31-.25 6.62-3.44 9.5z" fill="currentColor"></path>
                </g>
            </svg>
            <span className={`${delaGothic.className} text-center`}>palupi</span>
        </div>
    );
}

