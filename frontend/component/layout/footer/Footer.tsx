import React from "react";
import Logo from "@/component/util/base/Logo";

export default function Footer() {
    return(
        <footer className={`bottom-0 px-6 w-full`}>
            <div className={"h-12 bg-white flex items-center justify-between text-primary gap-2 font-semibold"}>
                <div className={"flex gap-4"} >
                  <Logo className={"text-admin-nav-text"} size={"sm"}/>
                </div>
                <div className={"text-sm flex items-center"}>Copyright <span className={"text-lg ml-1"}>©</span><span className={"text-sm ml-1"}> 2025</span></div>
            </div>
        </footer>
    )
}
