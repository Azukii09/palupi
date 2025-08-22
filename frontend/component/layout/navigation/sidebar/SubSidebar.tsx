"use client"
import React, {useState} from 'react';
import SidebarAdminComponent from "@/component/layout/navigation/sidebar/SidebarAdminComponent";
import {NavigationDataProps} from "@/lib/data/navigation/navigation_data";
import {HiMiniChevronDown} from "react-icons/hi2";
import {usePathname} from "next/navigation";

export default function SubSidebar({
    hasChildren,
    dataSidebar,
    buttonName,
    parentIcon,
    link,
}:{
    hasChildren?: number;
    dataSidebar?: NavigationDataProps[];
    buttonName?: string;
    parentIcon?: React.ReactNode;
    link?: string;
}) {
    const [active,setActive] = useState(false)
    const router = usePathname();

  return (
        <div className={"flex flex-col gap-4"}>
            <button
                onClick={()=> setActive(!active)}
                className={`${router.includes(link as string) && "bg-secondary/60 text-tertiary"} hover:bg-secondary/60 hover:text-white px-3 py-1 rounded-md w-full flex flex-col group cursor-pointer font-bold`}
            >
                <div className={`flex items-center max-w-36`}>
                    {parentIcon}
                    <span className={`ml-4`}>{buttonName}</span>
                </div>
                <div className={`${active?"rotate-0":"rotate-90"} absolute size-4 right-7 transition-all duration-300`}>
                    <HiMiniChevronDown className={"size-5"}/>
                </div>
            </button>
            {hasChildren && (
                <div
                    className={`w-full flex flex-col overflow-hidden transition-all duration-1000 ${active ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                    <SidebarAdminComponent dataSidebar={dataSidebar}/>
                </div>
            )}
        </div>
    );
}

