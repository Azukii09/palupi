"use client";

import React, {ReactNode} from "react";
import Button from "@/component/util/base/Button";
import {useModal} from "@/providers/context/ModalContext";

/**
 * Modal Header Subcomponent
 * Renders the header section of the modal with a title and optional close button
 * @param children - Content to be displayed as the modal header title
 * @param onClose - Optional callback function to handle modal close action
 */
const ModalHeader = ({children, onClose}: { children: ReactNode; onClose?: () => void }) => {
    return (
        <div
            className="flex-shrink-0 flex items-center w-full justify-center px-8 py-2 border-b-2 border-admin-background">
            <div className="flex items-center justify-between w-full">
                <h3 className="p-2 w-full tracking-wider text-lg font-semibold text-admin-title uppercase">
                    {children}
                </h3>
                {onClose && (
                    <button onClick={onClose} className="translate-x-1/2 cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-admin-title/70 hover:text-admin-title"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

/**
 * Modal Body Subcomponent
 * Renders the main content area of the modal, optionally wrapped in a form
 * @param children - Content to be displayed in the modal body
 * @param formId - Optional ID for the form element if content should be wrapped in a form
 * @param onSubmit - Optional callback function to handle form submission
 */
const ModalBody = ({
    children,
    formId,
    onSubmit,
}: {
    children: ReactNode;
    formId?: string;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
    return (
        <div className="flex-grow overflow-y-auto p-6 text-admin-text w-full">
            {formId ? (
                <form id={formId} className="w-full h-full" onSubmit={onSubmit}>
                    {children}
                </form>
            ) : (
                children
            )}
        </div>
    );
};

/**
 * Modal Footer Subcomponent
 * Renders the footer section of the modal with customizable buttons and additional content
 * @param children - Optional additional content for the footer
 * @param onClose - Optional callback function to handle modal close action
 * @param btnVariant - Style variant for the submit button
 * @param btnVariantType - Visual style type for the submit button
 * @param btnName - Name attribute for the submit button
 * @param btnText - Text to display on the submit button
 * @param btnSize - Size variant for the buttons
 * @param formId - Optional form ID to associate the submit button with a form
 * @param disable - Optional flag to disable the submit button
 */
const ModalFooter = ({
    children,
    onClose,
    btnVariant,
    btnVariantType,
    btnName,
    btnText,
    btnSize,
    formId,
    disable = false,
}: {
    children?: ReactNode;
    onClose?: () => void;
    btnVariant: "default" | "white" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "link";
    btnVariantType: "solid" | "outline" | "solid-rounded" | "outline-rounded";
    btnName: string;
    btnText: string;
    btnSize: "xs" | "sm" | "md" | "lg";
    formId?: string;
    disable?: boolean;
}) => {
    return (
        <div
            className="flex-shrink-0 px-6 py-4 bg-admin-foreground rounded-b-lg text-admin-text w-full border-t-2 border-admin-background/60">
            <div className={`${children ? "justify-between" : "justify-end"} flex items-center`}>
                {children}
                <div className="flex gap-2">
                    {/* Submit button */}
                    <Button
                        buttonType="submit"
                        variant={btnVariant ?? "default"}
                        variantType={btnVariantType}
                        buttonName={btnName ?? "submit"}
                        buttonText={btnText ?? "Submit"}
                        size={btnSize ?? "sm"}
                        formId={formId}
                        disabled={disable}
                    />
                    {/* Optional Close Button */}
                    {onClose && (
                        <Button
                            buttonType="button"
                            variant="white"
                            variantType="solid"
                            buttonName="close"
                            buttonText="Close"
                            size={btnSize ?? "sm"}
                            handler={onClose}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Main Modal Component
 * A reusable modal dialog component with customizable trigger button and content sections
 * @param id
 * @param modalSize
 * @param btnVariant - Style variant for the trigger button
 * @param btnVariantType - Visual style type for the trigger button
 * @param btnName - Name attribute for the trigger button
 * @param btnText - Text to display on the trigger button
 * @param btnSize - Size variant for the trigger button
 * @param btnBadge - Optional flag to show badge on trigger button
 * @param btnIcon - Optional icon to display on trigger button
 * @param btnOnlyIcon - Optional flag to show only icon without text
 * @param children - Modal content (Header, Body, Footer components)
 * @param formId - Optional form ID to associate with the modal content
 */
const Modal = ({
    id,
    modalSize = "md",
    btnVariant,
    btnVariantType,
    btnName,
    btnText,
    btnSize,
    btnBadge,
    btnIcon,
    btnOnlyIcon,
    children,
    formId,
}: {
    id:string;
    modalSize?: "sm" | "md" | "lg"|"xl"
    btnVariant: "default" | "white" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "link";
    btnVariantType?: "solid" | "outline" | "solid-rounded" | "outline-rounded";
    btnName: string;
    btnText: string;
    btnSize: "xs" | "sm" | "md" | "lg";
    btnBadge?: boolean;
    btnIcon?: ReactNode;
    btnOnlyIcon?: boolean;
    formId?: string;
    children: ReactNode;
}) => {
    const { modals, openModal, closeModal } = useModal(); // Gunakan context

    const isOpen = modals[id] || false; // Status modal berdasarkan ID

    // Function to handle modal close
    const handleClose = () => closeModal(id)
    ;

    return (
        <div>
            {/* Button to open modal */}
            <Button
                buttonType="button"
                variant={btnVariant}
                variantType={btnVariantType}
                buttonName={btnName}
                buttonText={btnText}
                size={btnSize}
                handler={() => openModal(id)}
                isBadge={btnBadge ?? false}
                icon={btnIcon && btnIcon}
                onlyIcon={btnOnlyIcon ?? false}
            />

            {/* Modal overlay and content */}
            <div
                className={`${
                    isOpen ? "visible bg-admin-accent/40 z-10" : "invisible"
                } fixed flex top-0 left-0 w-screen h-screen justify-center items-center transition-colors`}
            >
                {/* Overlay to close modal */}
                <div
                    className="fixed top-0 left-0 w-screen h-screen bg-black/20"
                    onClick={handleClose}
                ></div>

                {/* Modal content */}
                <div
                    className={`
                        ${isOpen ? "scale-100 opacity-100" : "scale-125 opacity-0"} 
                        ${modalSize === "xl" && "max-w-5/6"} 
                        ${modalSize === "lg" && "max-w-2/3"} 
                        ${modalSize === "md" && "max-w-1/2"} 
                        ${modalSize === "sm" && "max-w-1/3"} 
                        
                        transition-transform container bg-admin-foreground rounded-lg shadow-lg shadow-primary flex flex-col min-w-80 max-h-11/12`}
                >
                    {/* Pass handleClose function to children */}
                    {React.Children.map(children, (child) =>
                        React.isValidElement<{ formId?: string; onClose?: () => void }>(child)
                            ? React.cloneElement(child, {formId, onClose: handleClose})
                            : child
                    )}
                </div>
            </div>
        </div>
    );
};

// Register subcomponents as properties of the Modal component
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
