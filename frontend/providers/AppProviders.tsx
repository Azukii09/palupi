import React, { ReactNode } from 'react';
import {ModalProvider} from "@/app/_providers/context/ModalContext";

const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
        <ModalProvider>
            {children}
        </ModalProvider>
    );
};

export default AppProviders;