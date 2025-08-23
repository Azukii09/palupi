"use client"
import React, { createContext, useContext, useState, ReactNode, FC } from "react";

// Tipe untuk menyimpan modal yang aktif
interface ModalContextType {
    modals: { [key: string]: boolean }; // Penyimpanan ID dan status modal
    openModal: (id: string) => void;   // Fungsi untuk membuka modal
    closeModal: (id: string) => void; // Fungsi untuk menutup modal
}

// Buat context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider untuk membungkus aplikasi
export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [modals, setModals] = useState<{ [key: string]: boolean }>({});

    const openModal = (id: string) => {
        setModals((prev) => ({ ...prev, [id]: true }));
    };

    const closeModal = (id: string) => {
        setModals((prev) => ({ ...prev, [id]: false }));
    };

    return (
        <ModalContext.Provider value={{ modals, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

// Hook untuk menggunakan context
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};