import React from 'react';
import Image from "next/image";

export default function Avatar({
  size = "md",
  withShadow = true,
  shape = "circle",
  status,
  bgColor = "bg-admin-background",
  src,
}:{
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  withShadow?: boolean;
  shape: "circle" | "square";
  status?: "online" | "offline" | "busy";
  bgColor?: string;
  src?: string;
}) {
  return (
    <div
      className={`
                ${size === "xs" && "size-8"}
                ${size === "sm" && "size-12"}
                ${size === "md" && "size-18"}
                ${size === "lg" && "size-24"}
                ${size === "xl" && "size-30"}
                ${size === "2xl" && "size-36"}
                ${withShadow && "shadow-xs shadow-primary"}
                ${shape === "square" && "rounded-lg"}
                ${shape === "circle" && "rounded-full"}
                ${bgColor && bgColor}
                relative cursor-pointer`}
    >
      <Image
        src={src ? src : "/img/avatar-default.png"}
        alt={"avatar"}
        className={`
                    ${shape === "square" && "rounded-lg"}
                    ${shape === "circle" && "rounded-full"}
                    object-cover
                `}
        fill
      />
      {status &&
        <div
          className={`
                    ${shape === "circle" && size === "xs" && "size-2 -bottom-0.5 -right-0.5 ring-2 ring-white"}
                    ${shape === "circle" && size === "sm" && "size-4 -bottom-1 -right-1 ring-2 ring-white"}
                    ${shape === "circle" && size === "md" && "size-5 -bottom-1 -right-1 ring-3 ring-white"}
                    ${shape === "circle" && size === "lg" && "size-6 -bottom-1 right-0 ring-3 ring-white"}
                    ${shape === "circle" && size === "xl" && "size-7 -bottom-1 right-0 ring-3 ring-white"}
                    ${shape === "circle" && size === "2xl" && "size-8 bottom-0 right-0 ring-3 ring-white"}
                    
                    ${shape === "square" && size === "xs" && "size-2 -bottom-1 -right-1 ring-2 ring-white"}
                    ${shape === "square" && size === "sm" && "size-4 -bottom-2 -right-2 ring-2 ring-white"}
                    ${shape === "square" && size === "md" && "size-5 -bottom-2.5 -right-2.5 ring-3 ring-white"}
                    ${shape === "square" && size === "lg" && "size-6 -bottom-3 -right-3 ring-3 ring-white"}
                    ${shape === "square" && size === "xl" && "size-7 -bottom-3.5 -right-3.5 ring-3 ring-white"}
                    ${shape === "square" && size === "2xl" && "size-8 -bottom-4 -right-4 ring-3 ring-white"}
                    
                    ${status === "online" && "bg-success"}
                    ${status === "offline" && "bg-slate-300"}
                    ${status === "busy" && "bg-warning"}
                    absolute rounded-full
                `}/>
      }
    </div>
  );
}

