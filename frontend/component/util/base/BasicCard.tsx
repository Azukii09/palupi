import React from "react";

const BasicCardTitle = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-white px-6 py-4 rounded-t-md text-primary w-full border-b-1 border-slate-200">
            {children}
        </div>
    );
};

const BasicCardContent = ({ children, haveFooter = true }: { children: React.ReactNode, haveFooter?: boolean }) => {
    return (
        <div className={`${!haveFooter && "rounded-b-md"} bg-white py-5 px-3 text-primary w-full`}>
          <div className={"py-2 px-1 overflow-auto"}>
            {children}
          </div>
        </div>
    );
};

const BasicCardFooter = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-white px-6 py-4 rounded-b-md text-primary w-full border-t-1 border-slate-200">
            {children}
        </div>
    );
};

// Komponen utama Card1
const BasicCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="rounded-md text-primary w-full shadow-md shadow-primary/40">
            {children}
        </div>
    );
};

// Menambahkan properti statis
BasicCard.title = BasicCardTitle;
BasicCard.content = BasicCardContent;
BasicCard.footer = BasicCardFooter;

export default BasicCard;
