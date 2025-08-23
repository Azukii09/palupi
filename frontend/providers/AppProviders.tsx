import React, { ReactNode } from 'react';
import {ModalProvider} from "@/providers/context/ModalContext";

const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
        <ModalProvider>
            {children}
        </ModalProvider>
    );
};

export default AppProviders;
