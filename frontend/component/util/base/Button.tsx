import Link from "next/link";
import {ReactNode} from "react";

const buttonColor = [
    {
        keySet: "default",
        color: {
            "solid": "rounded-sm bg-black text-white",
            "outline": "rounded-md bg-black text-white border-2 border-white",
            "solid-rounded": "bg-black text-white rounded-full",
            "outline-rounded": "bg-black text-white border-2 border-white rounded-full"
        },
        disabled: {
            "solid": "rounded-sm bg-black text-white opacity-60",
            "outline": "rounded-md bg-black text-white border-2 border-white opacity-60",
            "solid-rounded": "bg-black text-white rounded-full opacity-60",
            "outline-rounded": "bg-black text-white border-2 border-white rounded-full opacity-60"
        },
        bgHover: "hover:text-white hover:bg-black/70"
    },
    {
        keySet: "white",
        color: {
            "solid": "rounded-sm bg-white text-primary",
            "outline": "rounded-md bg-white text-primary border border-admin-text",
            "solid-rounded": "bg-white text-primary rounded-full",
            "outline-rounded": "bg-white text-primary border border-admin-text rounded-full"
        },
        disabled: {
            "solid": "rounded-sm bg-white text-primary opacity-60",
            "outline": "rounded-md bg-white text-primary border border-admin-text opacity-60",
            "solid-rounded": "bg-white text-primary rounded-full opacity-60",
            "outline-rounded": "bg-white text-primary border border-admin-text rounded-full opacity-60"
        },
        bgHover: "hover:text-white hover:bg-primary/20"
    },
    {
        keySet: "primary",
        color: {
            "solid": "rounded-sm bg-primary text-white",
            "outline": "rounded-md bg-white text-primary border border-primary",
            "solid-rounded": "bg-primary text-white rounded-full",
            "outline-rounded": "bg-white text-primary border border-primary rounded-full"
        },
        disabled: {
            "solid": "rounded-sm bg-primary text-white opacity-60",
            "outline": "rounded-md  bg-white text-primary border border-primary opacity-60",
            "solid-rounded": "bg-primary text-white rounded-full opacity-60",
            "outline-rounded": "bg-white text-primary border border-primary rounded-full opacity-60"
        },
        bgHover: "hover:text-white hover:bg-primary/70"
    },
    {
        keySet: "secondary",
        color: {
            "solid": "rounded-sm bg-secondary text-white",
            "outline": "rounded-md bg-white text-secondary border border-secondary",
            "solid-rounded": "bg-secondary text-white rounded-full",
            "outline-rounded": "bg-white text-secondary border border-secondary rounded-full"
        },
        disabled: {
            "solid": "rounded-sm bg-secondary text-white opacity-60",
            "outline": "rounded-md bg-white text-secondary border border-secondary opacity-60",
            "solid-rounded": "bg-secondary text-white rounded-full opacity-60",
            "outline-rounded": "bg-white text-secondary border border-secondary rounded-full opacity-60"
        },
        bgHover: "hover:text-white hover:bg-secondary/70"
    },
    {
        keySet: "success",
        color: {
            "solid": "rounded-sm bg-success text-white",
            "outline": "rounded-md bg-white text-success border border-success",
            "solid-rounded": "bg-success text-white rounded-full",
            "outline-rounded": "bg-white text-success border border-success rounded-full"
        },
        disabled: {
            "solid": "rounded-sm bg-success text-white opacity-60",
            "outline": "rounded-md bg-white text-success border border-success opacity-60",
            "solid-rounded": "bg-success text-white rounded-full opacity-60",
            "outline-rounded": "bg-white text-success border border-success rounded-full opacity-60"
        },
        bgHover: "hover:text-white hover:bg-success/70"
    },
    {
        keySet: "warning",
        color: {
            "solid": "rounded-sm bg-warning text-white",
            "outline": "rounded-md bg-white text-warning border border-warning",
            "solid-rounded": "bg-warning text-white rounded-full",
            "outline-rounded": "bg-white text-warning border border-warning rounded-full"
        },
        disabled: {
            "solid": "rounded-sm bg-warning text-white opacity-60",
            "outline": "rounded-md bg-white text-warning border border-warning opacity-60",
            "solid-rounded": "bg-warning text-white rounded-full opacity-60",
            "outline-rounded": "bg-white text-warning border border-warning rounded-full opacity-60"
        },
        bgHover: "hover:text-white hover:bg-warning/70"
    },
    {
        keySet: "danger",
        color: {
            "solid": "rounded-sm bg-danger text-white",
            "outline": "rounded-md bg-white text-danger border border-danger",
            "solid-rounded": "bg-danger text-white rounded-full",
            "outline-rounded": "bg-white text-danger border border-danger rounded-full"
        },
        disabled: {
            "solid": "rounded-sm bg-danger text-white opacity-60",
            "outline": "rounded-md bg-white text-danger border border-danger opacity-60",
            "solid-rounded": "bg-danger text-white rounded-full opacity-60",
            "outline-rounded": "bg-white text-danger border border-danger rounded-full opacity-60"
        },
        bgHover: "hover:text-white hover:bg-danger/70"
    },
    {
        keySet: "info",
        color: {
            "solid": "rounded-sm bg-emerald-200 text-primary",
            "outline": "rounded-md bg-white text-emerald-200 border border-emerald-200",
            "solid-rounded": "bg-emerald-200 text-primary rounded-full",
            "outline-rounded": "bg-white text-emerald-200 border border-emerald-200 rounded-full"
        },
        disabled: {
            "solid": "rounded-sm bg-emerald-200 text-primary opacity-60",
            "outline": "rounded-md bg-white text-emerald-200 border border-emerald-200 opacity-60",
            "solid-rounded": "bg-emerald-200 text-primary rounded-full opacity-60",
            "outline-rounded": "bg-white text-emerald-200 border border-emerald-200 rounded-full opacity-60"
        },
        bgHover: "hover:text-white hover:bg-emerald-500/70"
    },
    {
        keySet: "link",
        color: {
            "solid": "rounded-sm text-primary",
            "outline": "text-primary",
            "solid-rounded": "text-primary",
            "outline-rounded": "text-primary"
        },
        disabled: {
            "solid": "rounded-sm text-primary opacity-60",
            "outline": "text-primary opacity-60",
            "solid-rounded": "text-primary opacity-60",
            "outline-rounded": "text-primary opacity-60"
        },
        bgHover: "hover:text-primary/70"
    }
]


export default function Button({
    buttonType = "button",
    variant,
    variantType = "solid",
    buttonName,
    buttonText,
    size = "xs",
    disabled = false,
    icon,
    onlyIcon = false,
    buttonLink,
    handler,
    isBadge = false,
    formId,
}:{
    buttonType: "button" | "submit" | "reset";
    variant: "default" | "white" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "link";
    variantType?: "solid" | "outline" | "solid-rounded" | "outline-rounded";
    buttonName: string;
    buttonText: string;
    size: "xs" |"sm" | "md" | "lg";
    disabled?: boolean;
    icon?: ReactNode;
    onlyIcon?: boolean;
    buttonLink?: string;
    handler?: () => void;
    isBadge?: boolean;
    formId?: string;
}) {
    const bgColor = !disabled?
        buttonColor.find((item) => item.keySet === variant)?.color[variantType]:
        buttonColor.find((item) => item.keySet === variant)?.disabled[variantType];
    const bgHover = !disabled && buttonColor.find((item) => item.keySet === variant)?.bgHover;

    return (
        <>
            {variant === "link"?
                <Link
                    href={buttonLink? buttonLink : "/public"}
                    aria-disabled={disabled}
                    tabIndex={disabled ? -1 : undefined}
                    className={`
                        ${bgColor}
                        ${bgHover}
                        ${isBadge? "text-xs p-1" : onlyIcon ? "text-xs p-1" : size === "xs" &&  "text-xs p-2"}
                        ${isBadge? "text-xs p-1" : onlyIcon ? "text-sm p-1.5" : size === "sm" && "text-sm px-4 py-2"}
                        ${isBadge? "text-xs p-1" : onlyIcon ? "text-md p-2" : size === "md" && "text-md px-6 py-3"}
                        ${isBadge? "text-xs p-1" : onlyIcon ? "text-lg p-2.5" : size === "lg" && "text-lg px-8 py-4"}
                        
                        ${disabled && "pointer-events-none"}
                        flex gap-2 items-center font-bold text-nowrap
                    `}
                >
                    {icon && icon}
                    <span className={`${onlyIcon?"hidden": "flex"}`}>
                        {buttonText}
                    </span>
                </Link>:
                <button
                    name={buttonName as string}
                    type={buttonType}
                    onClick={handler}
                    className={`
                        ${bgColor}
                        ${bgHover}
                        ${isBadge? "text-xs p-1" : onlyIcon ? "text-xs p-1" : size === "xs" &&  "text-xs p-2"}
                        ${isBadge? "text-xs p-1" : onlyIcon ? "text-sm p-1.5" : size === "sm" && "text-sm px-4 py-2"}
                        ${isBadge? "text-xs p-1" : onlyIcon ? "text-md p-2" : size === "md" && "text-md px-6 py-3"}
                        ${isBadge? "text-xs p-1" : onlyIcon ? "text-lg p-2.5" : size === "lg" && "text-lg px-8 py-4"}
                        
                        ${!disabled && "cursor-pointer"}
                        flex gap-2 items-center font-bold shadow-xs shadow-primary text-nowrap
                    `}
                    form={formId && formId}
                >
                    {icon && icon}
                    <span className={`${onlyIcon?"hidden": "flex"}`}>
                        {buttonText}
                    </span>
                </button>
            }
        </>
    );
}

