import {Metadata} from "next";
import React from "react";
import SidebarAdminMain from "@/component/layout/navigation/sidebar/SidebarAdminMain";
import Footer from "@/component/layout/footer/Footer";

export const metadata: Metadata = {
  title: "Palupi",
  description: "Point of Sale (POS) application for Palupi Duck Restaurant - Streamline your restaurant operations with our comprehensive POS system",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section
      id="main-content"
      className={"flex w-full"}
    >
      <SidebarAdminMain/>
      <div className={"w-full md:max-w-[calc(100%-16rem)] md:ml-64 flex-1 flex flex-col"}>
        <div className={"fixed w-full md:max-w-[calc(100%-16rem)] top-0 z-10"}>
          {/*<NavbarAdmin/>*/}
        </div>
        <div className={"w-full bg-slate-200 min-h-screen mt-20"}>
          <div className="container mx-auto p-8">
            {/*<Breadcrumb/>*/}
            <div className={"flex flex-col w-full justify-between gap-4 lg:pl-10"}>
              {children}
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </section>
  );
}
