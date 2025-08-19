"use client"
import Link from "next/link";
import {usePathname} from "next/navigation";
import SubSidebar from "@/component/layout/navigation/sidebar/SubSidebar";
import {NavigationDataProps} from "@/lib/data/navigation/navigation_data";

export default function SidebarAdminComponent({
    dataSidebar,
}:{
    dataSidebar?: NavigationDataProps[] ;
}) {
    //
    const hasChildren = dataSidebar && dataSidebar.length
    const router = usePathname();
    return (
        <div className={"w-full flex flex-col pl-5"}>
            {dataSidebar?.map((item, index) => (
                item.navigation && item.navigation.length ?
                    <SubSidebar
                        key={index}
                        dataSidebar={item.navigation}
                        buttonName={item.name}
                        hasChildren={hasChildren}
                        parentIcon={item.icon}
                    />
                    :
                    <div
                        key={index}
                        className={`${router.endsWith(item.link) && "text-admin-title/80 bg-admin-sidebar-background-active/15 rounded-md md:text-admin-text/65"} hover:text-admin-sidebar-text hover:bg-admin-sidebar-background-active/80 hover:rounded-md  px-3 py-1 w-full flex flex-col group cursor-pointer mb-4`}
                    >
                        <Link
                            href={item.link}
                            className={"inline-flex items-center justify-between w-full font-bold"}
                        >
                            <div className={`flex gap-4 items-center group-hover:text-admin-sidebar-text`}>
                                {item.icon}
                                <span>{item.name}</span>
                            </div>
                        </Link>
                    </div>
            ))}
        </div>
    );
}


