import React, { ReactNode } from 'react';
import {ModalProvider} from "@/providers/context/ModalContext";
import {ToastProvider} from "@/providers/context/ToastProvider";

const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
      <ToastProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </ToastProvider>
    );
};

export default AppProviders;
