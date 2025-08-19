"use client"
import React from 'react';
import Link from "next/link";
import {useParams} from "next/navigation";
import SidebarAdminComponent from "@/component/layout/navigation/sidebar/SidebarAdminComponent";
import {navigationData} from "@/lib/data/navigation/navigation_data";

function SidebarAdminMain() {
    const params = useParams();
    const dataSidebar =  navigationData.find((item) => item.locale === params.locale);
    return (
        <aside className={"z-0 hidden md:block md:fixed flex-shrink-0 min-h-screen max-h-screen border-r-2 border-slate-100 relative w-64 flex-col  text-admin-title gap-4 overflow-y-auto text-sm capitalize"}>
            <Link href={"/"} className={"w-full flex items-center justify-center py-5 shadow-xs shadow-admin-sidebar-background-active/20 mb-6"}>
                {/*<Logo className={"text-admin-nav-text"} size={"md"}/>*/}
              logo
            </Link>
            {/*<SidebarAdmin/>*/}
            <div className={"flex flex-col gap-2 pr-5"}>
                <SidebarAdminComponent dataSidebar={dataSidebar?.navigation}/>
            </div>
        </aside>
    );
}

export default SidebarAdminMain;
