"use client"
import React, {useState} from 'react';
import SidebarAdminComponent from "@/component/layout/navigation/sidebar/SidebarAdminComponent";
import {NavigationDataProps} from "@/lib/data/navigation/navigation_data";
import {HiMiniChevronDown} from "react-icons/hi2";

export default function SubSidebar({
    hasChildren,
    dataSidebar,
    buttonName,
    parentIcon,
}:{
    hasChildren?: number;
    dataSidebar?: NavigationDataProps[];
    buttonName?: string;
    parentIcon?: React.ReactNode;
}) {
    const [active,setActive] = useState(false)

    return (
        <div className={"flex flex-col gap-4"}>
            <button
                onClick={()=> setActive(!active)}
                className={`hover:bg-admin-sidebar-background-active hover:text-admin-sidebar-text px-3 py-1 rounded-md w-full flex flex-col group cursor-pointer font-bold`}
            >
                <div className={`flex items-center max-w-36`}>
                    {parentIcon}
                    <span className={`ml-4`}>{buttonName}</span>
                </div>
                <div className={`${active?"rotate-0":"rotate-90"} absolute size-4 right-7 hover:text-admin-sidebar-text transition-all duration-300`}>
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

