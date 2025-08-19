"use client"
import {useTranslations} from "next-intl";
import React from "react";
import MobileNavbar from "@/component/layout/navigation/navbar/MobileNavbar";
import {HiBell, HiEnvelope, HiMagnifyingGlass} from "react-icons/hi2";

export default function NavbarAdmin() {
    const formTranslate = useTranslations('form');

    return (
            <nav className={"h-20 bg-admin-navbar-background font-medium text-admin-title px-6 relative"}
            >
                {/*mobile view nav*/}
                <div className={"flex items-center h-full justify-between md:hidden z-50"}>
                    {/*mobile hamburger*/}
                    <MobileNavbar/>
                    <div>
                        {/*<Logo className={"text-admin-nav-text"} size={"sm"}/>*/}
                    </div>
                </div>

                {/*large view*/}
                <div className={"hidden md:flex h-full items-center justify-between "}>
                    <div className={"flex gap-2"}>
                        <div className="w-full flex flex-1 items-center justify-between bg-form-background p-2 rounded-xl px-4">
                            <HiMagnifyingGlass className={"size-5 text-form-placeholder"} />
                            <input
                                type="text"
                                name="search"
                                placeholder={formTranslate('search')}
                                className={"flex flex-1 px-2 border-none rounded-full focus:outline-none placeholder-form-placeholder capitalize"}
                            />
                        </div>
                    </div>
                    <div className={"flex w-1/2 gap-4 items-center justify-end"}>
                        <HiEnvelope className={"size-6 text-admin-navbar-text cursor-pointer"}/>
                        <HiBell className={"size-6 text-admin-navbar-text cursor-pointer"}/>
                        {/*<Avatar*/}
                        {/*    size={"sm"}*/}
                        {/*    withShadow={false}*/}
                        {/*    shape={"circle"}*/}
                        {/*/>*/}
                        {/*<LanguageChanger/>*/}
                    </div>
                    {/*auth form button*/}
                </div>
            </nav>
    );
}

