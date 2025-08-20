"use client"
import React, { useState } from 'react';
import {useParams} from "next/navigation";
import {navigationData} from "@/lib/data/navigation/navigation_data";
import {HiBars4} from "react-icons/hi2";
import SidebarAdminComponent from "@/component/layout/navigation/sidebar/SidebarAdminComponent";
import Logo from "@/component/util/base/Logo";

export default function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const params = useParams();
    const dataSidebar =  navigationData.find((item) => item.locale === params.locale);

    return (
        <div className="flex gap-4 capitalize">
            <HiBars4
                className="size-8 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            />
            <div
                className={`-z-10 fixed inset-0 bg-secondary/30 transition-opacity duration-700 cursor-pointer ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />
            <div
                className={`fixed top-20 left-0 w-64 h-screen overflow-y-scroll pt-8 pb-24 pr-5 bg-primary text-white shadow-lg transform transition-transform duration-700 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
              <div className={"w-full flex flex-col pl-5 items-center py-6"}>
                <Logo className={"text-white"} size={"md"}/>
              </div>
              <SidebarAdminComponent dataSidebar={dataSidebar?.navigation}/>
            </div>
        </div>
    );
}
